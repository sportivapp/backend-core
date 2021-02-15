const ThreadPostReply = require('../models/ThreadPostReply')
const threadPostService = require('./threadPostService')
const threadService = require('./threadService')
const threadModeratorService = require('./threadModeratorService')
const notificationService = require('./notificationService')
const NotificationEnum = require('../models/enum/NotificationEnum')
const userService = require('./userService')
const { UnsupportedOperationError } = require('../models/errors')

const threadPostReplyService = {}

const ErrorEnum = {
    POST_NOT_FOUND: 'POST_NOT_FOUND',
    REPLY_NOT_FOUND: 'REPLY_NOT_FOUND',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    USER_NOT_FOUND: 'USER_NOT_FOUND'
}

threadPostReplyService.getAllByThreadPostId = async (threadPostId, user) => {

    const post = await threadPostService.getPostById(threadPostId).catch(() => null)

    if (!post) return []

    const replies = await ThreadPostReply.query()
        .where('ethreadpostethreadpostid', threadPostId)
        .modify('baseAttributes')
        .withGraphFetched('user(idAndName)')
        .withGraphFetched('threadPostReplyPicture(baseAttributes)')
        .withGraphFetched('moderator')
        .orderBy('ethreadpostreplycreatetime', 'ASC')
        .modifyGraph('moderator', builder => {
            builder
                .select('eusereuserid')
                .groupBy('eusereuserid')
                .where('ethreadethreadid', post.ethreadethreadid)
                .first()
        })

    return replies.map(reply => ({
        ethreadpostreplyid: reply.ethreadpostreplyid,
        ethreadpostreplycomment: reply.ethreadpostreplycomment,
        ethreadpostreplycreatetime: reply.ethreadpostreplycreatetime,
        ethreadpostreplychangetime: reply.ethreadpostreplychangetime,
        threadPostReplyPicture: reply.threadPostReplyPicture,
        user: reply.user,
        isModerator: !!reply.moderator,
        isModifiable: reply.user.euserid === user.sub
    }))
}

threadPostReplyService.getReplyById = async (replyId) => {

    return ThreadPostReply.query()
        .findById(replyId)
        .modify('baseAttributes')
}

threadPostReplyService.createReplyByThreadPostId = async (threadPostId, replyDTO, user) => {

    const post = await threadPostService.getPostById(threadPostId).catch(() => null)

    if (!post) throw new UnsupportedOperationError(ErrorEnum.POST_NOT_FOUND)

    const thread = await threadService.getThreadDetailById(post.ethreadethreadid)
        .catch(() => new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND))

    if (thread.ethreadlock) throw new UnsupportedOperationError(ErrorEnum.THREAD_LOCKED)

    const foundUser = await userService.getSingleUserById(user.sub)
        .catch(() => new UnsupportedOperationError(ErrorEnum.USER_NOT_FOUND));

    replyDTO.ethreadethreadid = post.ethreadethreadid
    replyDTO.ethreadpostethreadpostid = threadPostId

    // To comment creator
    const postEnum = NotificationEnum.forumPost
    const postCreateAction = postEnum.actions.reply
    const commentNotificationObj = await notificationService
        .buildNotificationEntity(post.ethreadpostid, postEnum.type, postCreateAction.title, postCreateAction.message(foundUser.eusername), postCreateAction.title)
    // If comment creator is thread creator, notify the thread instead
    let commentUserIds = [];
    if (post.ethreadpostcreateby !== thread.ethreadcreateby) {
        commentUserIds.push(post.ethreadpostcreateby);
    }

    if (replyDTO.ethreadpostreplyethreadpostreplyid) {

        // To reply creator
        const replyTo = await ThreadPostReply.query()
            .findById(replyDTO.ethreadpostreplyethreadpostreplyid);
        const replyEnum = NotificationEnum.forumPostReply
        const replyCreateAction = replyEnum.actions.reply
        const replyNotificationObj = await notificationService
            .buildNotificationEntity(replyTo.ethreadpostreplyid, replyEnum.type, replyCreateAction.title, replyCreateAction.message(foundUser.eusername), replyCreateAction.title)
        // If reply creator is thread creator, notify the thread instead
        let replyUserIds = [];
        if (replyTo.ethreadpostreplycreateby !== thread.ethreadcreateby) {
            replyUserIds.push(replyTo.ethreadpostreplycreateby);
        }
        notificationService.saveNotification(replyNotificationObj, user, replyUserIds);

    }

    // To thread creator
    const threadEnum = NotificationEnum.forum
    const threadCreateAction = threadEnum.actions.reply
    const threadNotificationObj = await notificationService
        .buildNotificationEntity(thread.ethreadid, threadEnum.type, threadCreateAction.title, threadCreateAction.message(foundUser.eusername), threadCreateAction.title)
    let threadUserIds = [thread.ethreadcreateby];

    notificationService.saveNotification(commentNotificationObj, user, commentUserIds);
    notificationService.saveNotification(threadNotificationObj, user, threadUserIds);

    return ThreadPostReply.query()
        .insertToTable(replyDTO, user.sub);

}

threadPostReplyService.editReplyById = async (replyId, replyDTO, user) => {

    const reply = await threadPostReplyService.getReplyById(replyId)

    if (!reply) throw new UnsupportedOperationError(ErrorEnum.REPLY_NOT_FOUND)

    if (reply.ethreadpostreplycreateby !== user.sub) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)

    const post = await threadPostService.getPostById(reply.ethreadpostethreadpostid).catch(() => null)

    if (!post) throw new UnsupportedOperationError(ErrorEnum.POST_NOT_FOUND)

    const thread = await threadService.getThreadDetailById(post.ethreadethreadid)
        .catch(() => new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND))

    if (thread.ethreadlock) throw new UnsupportedOperationError(ErrorEnum.THREAD_LOCKED)

    return reply.$query()
        .updateByUserId(replyDTO, user.sub)
        .returning('*')

}

threadPostReplyService.deleteReplyById = async (replyId, user) => {

    const reply = await threadPostReplyService.getReplyById(replyId)

    if (!reply) return false

    if (reply.ethreadpostreplycreateby !== user.sub) {

        const post = await threadPostService.getPostById(reply.ethreadpostethreadpostid);

        const isModerator = await threadModeratorService.isThreadModerator(post.ethreadethreadid, user.sub)
        if (!isModerator) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)
    }

    return ThreadPostReply.query()
        .findById(replyId)
        .deleteByUserId(user.sub)
        .then(rowsAffected => rowsAffected === 1)

}

threadPostReplyService.getThreadPostIdsByUserId = async (userId) => {{

    return ThreadPostReply.query()
        .where('ethreadpostreplycreateby', userId)
        .where('ethreadpostreplydeletestatus', false)
        .then(threadPostReplies => threadPostReplies.map(threadPostReply => threadPostReply.ethreadpostethreadpostid))

}}

threadPostReplyService.getThreadDetailByReplyId = async (replyId) => {

    const reply = await threadPostReplyService.getReplyById(replyId);

    return threadService.getThreadById(reply.ethreadethreadid);

}

module.exports = threadPostReplyService