const ThreadPost = require('../models/ThreadPost')
const ServiceHelper = require('../helper/ServiceHelper')
const threadService = require('./threadService')
const threadModeratorService = require('./threadModeratorService')
const fileService = require('./fileService')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const threadPostService = {}

const ErrorEnum = {
    POST_NOT_FOUND: 'POST_NOT_FOUND',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    THREAD_LOCKED: 'THREAD_LOCKED'
}

threadPostService.getAllPostByThreadId = async (threadId, page, size) => {

    let threadPostPage = await ThreadPost.query()
        .modify('baseAttributes')
        .where('ethreadethreadid', threadId)
        .withGraphFetched('user(idAndName)')
        .withGraphFetched('moderator')
        .modifyGraph('moderator', builder => {
            builder
                .select('eusereuserid')
                .groupBy('eusereuserid')
                .where('ethreadethreadid', threadId)
                .first()
        })
        .page(page, size)

    threadPostPage.results = threadPostPage.results.map(threadPost => ({
        ethreadpostcomment: threadPost.ethreadpostcomment,
        ethreadpostcreatetime: threadPost.ethreadpostcreatetime,
        user: threadPost.user,
        isModerator: !!threadPost.moderator
    }))

    return ServiceHelper.toPageObj(page, size, threadPostPage)
}

threadPostService.getPostById = async (threadPostId) => {
    return ThreadPost.query()
        .findById(threadPostId)
        .then(post => {
            if (!post) throw new NotFoundError()
            return post
        })
}

threadPostService.createPost = async (threadId, postDTO, user) => {

    if (postDTO.efileefileid) {
        const file = await fileService.getFileById(postDTO.efileefileid)
        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    }

    const thread = await threadService.getThreadById(threadId)
        .catch(() => { throw new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND) })

    if (thread.ethreadlock) throw new UnsupportedOperationError(ErrorEnum.THREAD_LOCKED)

    postDTO.ethreadethreadid = thread.ethreadid

    return ThreadPost.query()
        .insertToTable(postDTO, user.sub)
}

threadPostService.updatePost = async (commentId, postDTO, user) => {

    if (postDTO.efileefileid) {
        const file = await fileService.getFileById(postDTO.efileefileid)
        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    }

    const thread = await threadService.getThreadById(threadId)
        .catch(() => new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND))

    if (thread.ethreadlock) throw new UnsupportedOperationError(ErrorEnum.THREAD_LOCKED)

    return threadPostService.getPostById(commentId)
        .catch(() => new UnsupportedOperationError(ErrorEnum.POST_NOT_FOUND))
        .then(post => {
            if (post.ethreadpostcreateby !== user.sub) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)
            return post
        })
        .then(post => post.$query().updateByUserId(postDTO, user.sub).returning('*'))
}

threadPostService.deletePost = async (commentId, user) => {

    const post = threadPostService.getPostById(commentId).catch(() => null)

    if (!post) return false

    if (post.ethreadpostcreateby !== user.sub) {
        const isModerator = await threadModeratorService.isThreadModerator(post.ethreadethreadid, user.sub)
        if (!isModerator) return false
    }

    return post.$query()
        .delete()
        .then(rowsAffected => rowsAffected === 1)

}

module.exports = threadPostService