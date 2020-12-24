const ThreadPost = require('../models/ThreadPost')
const ServiceHelper = require('../helper/ServiceHelper')
const threadService = require('./threadService')
const threadModeratorService = require('./threadModeratorService')
const fileService = require('./fileService')
const notificationService = require('./notificationService')
const NotificationEnum = require('../models/enum/NotificationEnum')
const userService = require('./userService')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const threadPostService = {}

const ErrorEnum = {
    POST_NOT_FOUND: 'POST_NOT_FOUND',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    THREAD_LOCKED: 'THREAD_LOCKED',
    USER_NOT_FOUND: 'USER_NOT_FOUND'
}

threadPostService.getAllPostByThreadId = async (threadId, page, size) => {

    let threadPostPage = await ThreadPost.query()
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
        isModerator: !!threadPost.moderator
    }))

    return ServiceHelper.toPageObj(page, size, threadPostPage)
}

threadPostService.getPostById = async (threadPostId) => {
    return ThreadPost.query()
        .findById(threadPostId)
        .modify('baseAttributes')
        .then(post => {
            if (!post) throw new NotFoundError()
            return post
        })
}

threadPostService.createPost = async (threadId, postDTO, user) => {

    const thread = await threadService.getThreadDetailById(threadId)
        .catch(() => { throw new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND) })

    if (thread.ethreadlock) throw new UnsupportedOperationError(ErrorEnum.THREAD_LOCKED)

    if (postDTO.efileefileid) {
        const file = await fileService.getFileById(postDTO.efileefileid)
        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    }

    const foundUser = await userService.getSingleUserById(user.sub)
        .catch(() => new UnsupportedOperationError(ErrorEnum.USER_NOT_FOUND));

    postDTO.ethreadethreadid = thread.ethreadid

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

        return ThreadPost.query(trx).insertToTable(postDTO, user.sub)
    })
}

threadPostService.updatePost = async (commentId, postDTO, user) => {

    const post = await threadPostService.getPostById(commentId)
        .catch(() => new UnsupportedOperationError(ErrorEnum.POST_NOT_FOUND))

    if (postDTO.efileefileid) {
        const file = await fileService.getFileById(postDTO.efileefileid)
        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    }

    const thread = await threadService.getThreadDetailById(post.ethreadethreadid)
        .catch(() => new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND))

    if (thread.ethreadlock) throw new UnsupportedOperationError(ErrorEnum.THREAD_LOCKED)

    if (post.ethreadpostcreateby !== user.sub) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)

    return post.$query().updateByUserId(postDTO, user.sub).returning('*')
}

threadPostService.deletePost = async (commentId, user) => {

    const post = await threadPostService.getPostById(commentId).catch(() => null)

    if (!post) return false

    const thread = await threadService.getThreadDetailById(post.ethreadethreadid)
        .catch(() => new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND))

    if (thread.ethreadlock) throw new UnsupportedOperationError(ErrorEnum.THREAD_LOCKED)

    if (post.ethreadpostcreateby !== user.sub) {
        const isModerator = await threadModeratorService.isThreadModerator(post.ethreadethreadid, user.sub)
        if (!isModerator) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)
    }

    return ThreadPost.query()
        .findById(commentId)
        .deleteByUserId(user.sub)
        .then(rowsAffected => rowsAffected === 1)

}

module.exports = threadPostService