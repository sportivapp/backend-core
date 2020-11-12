const ThreadPostReply = require('../models/ThreadPostReply')
const threadPostService = require('./threadPostService')
const threadService = require('./threadService')
const threadModeratorService = require('./threadModeratorService')
const { UnsupportedOperationError } = require('../models/errors')

const threadPostReplyService = {}

const ErrorEnum = {
    POST_NOT_FOUND: 'POST_NOT_FOUND',
    REPLY_NOT_FOUND: 'REPLY_NOT_FOUND',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION'
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
}

threadPostReplyService.createReplyByThreadPostId = async (threadPostId, replyDTO, user) => {

    const post = await threadPostService.getPostById(threadPostId).catch(() => null)

    if (!post) throw new UnsupportedOperationError(ErrorEnum.POST_NOT_FOUND)

    const thread = await threadService.getThreadDetailById(post.ethreadethreadid)
        .catch(() => new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND))

    if (thread.ethreadlock) throw new UnsupportedOperationError(ErrorEnum.THREAD_LOCKED)

    replyDTO.ethreadethreadid = post.ethreadethreadid
    replyDTO.ethreadpostethreadpostid = threadPostId

    return ThreadPostReply.query().insertToTable(replyDTO, user.sub)

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

        const isModerator = await threadModeratorService.isThreadModerator(reply.ethreadethreadid, user.sub)
        if (!isModerator) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)
    }

    return reply.$query()
        .delete()
        .then(rowsAffected => rowsAffected === 1)

}

threadPostReplyService.getThreadPostIdsByUserId = async (userId) => {{

    return ThreadPostReply.query()
        .where('ethreadpostreplycreateby', userId)
        .then(threadPostReplies => threadPostReplies.map(threadPostReply => threadPostReply.ethreadpostethreadpostid))

}}

module.exports = threadPostReplyService