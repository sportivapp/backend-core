const ServiceHelper = require('../helper/ServiceHelper')
const ThreadPost = require('../models/ThreadPost')
const ThreadModerator = require('../models/ThreadModerator')
const { UnsupportedOperationError } = require('../models/errors')
const mobileForumService = require('../services/mobileForumService')
const notificationService = require('./notificationService')
const NotificationEnum = require('../models/enum/NotificationEnum')
const userService = require('./userService')
const threadService = require('./threadService');

const mobileCommentService = {}

const UnsupportedOperationErrorEnum = {
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    COMMENT_NOT_EXISTS: 'COMMENT_NOT_EXIST',
    THREAD_NOT_EXISTS: 'THREAD_NOT_EXISTS',
    THREAD_LOCKED: 'THREAD_LOCKED',
    USER_NOT_FOUND: 'USER_NOT_FOUND'
}

// Change name from commentId to threadPostId here to match the column name in migration table
mobileCommentService.checkCommentMaker = async (threadPostId, userId) => {
    
    return ThreadPost.query()
    .findById(threadPostId)
    .where('ethreadpostcreateby', userId)
    .then(comment => {
        if (!comment) return false
        return true
    })

}

// Change name from commentId to threadPostId here to match the column name in migration table
mobileCommentService.checkMakerAndModerator = async (threadPostId, userId) => {

    return ThreadPost.query()
    .findById(threadPostId)
    .then(comment => {

        if(!comment) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMMENT_NOT_EXISTS)

        // if its the comment maker
        if(comment.ethreadpostcreateby === userId) return true

        //if not the maker, check if its the moderator
        return ThreadModerator.query()
        .where('ethreadethreadid', comment.ethreadethreadid)
        .where('eusereuserid', userId)
        .first()
        .then(moderator => {
            if(!moderator) return false
            return true
        })
    })

}

mobileCommentService.createComment = async (commentDTO, user) => {

    const threadExist = await mobileForumService.checkThread(commentDTO.ethreadethreadid)

    const thread = await mobileForumService.getThreadById(commentDTO.ethreadethreadid)

    if(!threadExist) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_NOT_EXISTS)

    if (threadExist.ethreadlock) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_LOCKED)

    //Normalize fileId if frontend insert this kind of data
    if(commentDTO.efileefileid === undefined || commentDTO.efileefileid === null || commentDTO.efileefileid === 0) {
        commentDTO.efileefileid = null
    }

    const foundUser = await userService.getSingleUserById(user.sub)
        .catch(() => new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_FOUND));

    const postEnum = NotificationEnum.forum
    const createAction = postEnum.actions.comment

    const notificationObj = await notificationService
        .buildNotificationEntity(thread.ethreadid, postEnum.type, createAction.title, createAction.message(foundUser.eusername), createAction.title)

    const userIds = await ThreadPost.query()
        .where('ethreadethreadid', thread.ethreadid)
        .then(posts => posts.map(post => ({ euserid: post.ethreadpostcreateby })))
        .then(userIds => {
            userIds.push({ euserid: thread.ethreadcreateby })
            return userIds.filter(postedUser => postedUser.euserid !== user.sub)
        })

    return ThreadPost.transaction(async trx => {

        notificationService.saveNotificationWithTransaction(notificationObj, user, userIds, trx)

        return ThreadPost.query().insertToTable(commentDTO, user.sub)
    })

}

mobileCommentService.updateComment = async (commentId, commentDTO, user) => {

    const comment = await ThreadPost.query()
        .findById(commentId)

    if (!comment) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMMENT_NOT_EXISTS)

    const threadExist = await mobileForumService.checkThread(comment.ethreadethreadid)

    if(!threadExist) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_NOT_EXISTS)

    if (threadExist.ethreadlock) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_LOCKED)

    const commentMaker = await mobileCommentService.checkCommentMaker(commentId, user.sub)

    if(!commentMaker)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    //Normalize fileId if frontend insert this kind of data
    if(commentDTO.efileefileid === undefined || commentDTO.efileefileid === null || commentDTO.efileefileid === 0) {
        commentDTO.efileefileid = null
    }

    return ThreadPost.query()
    .findById(commentId)
    .updateByUserId(commentDTO, user.sub)
    .returning('*')
    .then(comment => {
        if(!comment) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMMENT_NOT_EXISTS)
        return comment
    })

}

mobileCommentService.getAllComments = async (page, size, threadId, user) => {

    const threadPostPage = await ThreadPost.query()
        .modify('baseAttributes')
        .select(ThreadPost.relatedQuery('replies').modify('notDeleted').count().as('replyCount'))
        .where('ethreadethreadid', threadId)
        .withGraphFetched('user(idAndName)')
        .withGraphFetched('threadPostPicture(baseAttributes)')
        .withGraphFetched('moderator')
        .orderBy('ethreadpostcreatetime', 'ASC')
        .modifyGraph('moderator', builder => {
            builder
                .select('eusereuserid')
                .groupBy('eusereuserid')
                .where('ethreadethreadid', threadId)
                .first()
        })
        .page(page, size)

    threadPostPage.results = threadPostPage.results.map(threadPost => ({
        ethreadpostid: threadPost.ethreadpostid,
        ethreadpostcomment: threadPost.ethreadpostcomment,
        ethreadpostcreatetime: threadPost.ethreadpostcreatetime,
        ethreadpostchangetime: threadPost.ethreadpostchangetime,
        replyCount: parseInt(threadPost.replyCount),
        threadPostPicture: threadPost.threadPostPicture,
        user: threadPost.user,
        isModerator: !!threadPost.moderator,
        isModifiable: threadPost.user.euserid === user.sub
    }))

    return ServiceHelper.toPageObj(page, size, threadPostPage)

}

mobileCommentService.getCommentById = async (commentId) => {

    return ThreadPost.query()
        .modify('baseAttributes')
        .where('ethreadpostid', commentId)
        .withGraphFetched('thread(baseAttributes)')
        .first()

}

mobileCommentService.deleteComment = async (commentId, user) => {

    const comment = await ThreadPost.query()
        .findById(commentId)

    if (!comment) return false

    const threadExist = await mobileForumService.checkThread(comment.ethreadethreadid)

    if(!threadExist) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_NOT_EXISTS)

    if (threadExist.ethreadlock) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_LOCKED)

    const checkMakerAndModerator = await mobileCommentService.checkMakerAndModerator(commentId, user.sub)

    if(!checkMakerAndModerator)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    return ThreadPost.query()
    .delete()
    .where('ethreadpostid', commentId)
    .then(rowsAffected => rowsAffected === 1)

}

mobileCommentService.getThreadIdsByUserIdAndThreadPostIds = async (userId, threadPostIds) => {{

    return ThreadPost.query()
        .where('ethreadpostcreateby', userId)
        .orWhereIn('ethreadpostid', threadPostIds)
        .then(threadPosts => threadPosts.map(threadPost => threadPost.ethreadethreadid))

}}

mobileCommentService.getThreadDetailByCommentId = async (commentId) => {

    const comment = await mobileCommentService.getCommentById(commentId);

    return threadService.getThreadById(comment.ethreadethreadid);

}

module.exports = mobileCommentService