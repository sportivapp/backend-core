const ResponseHelper = require('../../helper/ResponseHelper')
const threadPostService = require('../../services/threadPostService')

const threadPostController = {}

threadPostController.getAllPostByThreadId = async (req, res, next) => {

    const { threadId } = req.params

    const { page = '0', size = '10' } = req.params

    try {
        const result = await threadPostService.getAllPostByThreadId(threadId, parseInt(page), parseInt(size))
        return res.status(200).json(ResponseHelper.toPageResponse(result.data, result.paging))
    } catch (e) {
        next(e)
    }
}

threadPostController.createPost = async (req, res, next) => {

    const { threadId } = req.params

    const { comment, fileId } = req.body

    const threadPostDTO = {
        ethreadpostcomment: comment,
        efileefileid: fileId
    }

    try {
        const result = await threadPostService.createPost(threadId, threadPostDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

threadPostController.updatePost = async (req, res, next) => {

    const { commentId } = req.params

    const { comment, fileId } = req.body

    const threadPostDTO = {
        ethreadpostcomment: comment,
        efileefileid: parseInt(fileId)
    }

    try {
        const result = await threadPostService.updatePost(commentId, threadPostDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

threadPostController.deletePost = async (req, res, next) => {

    const { commentId } = req.params

    try {
        const result = await threadPostService.deletePost(commentId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

module.exports = threadPostController