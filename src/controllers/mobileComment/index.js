const mobileCommentService = require('../../services/mobileCommentService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.createComment = async (req, res, next) => {

    const { comment, threadId, fileId } = req.body

    const commentDTO = {
        ethreadpostcomment: comment,
        ethreadethreadid: threadId,
        efileefileid: fileId
    }

    try {
        
        const result = await mobileCommentService.createComment(commentDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }

}

controller.updateComment = async (req, res, next) => {

    const { commentId } = req.params
    const { comment, fileId } = req.body

    const commentDTO = {
        ethreadpostcomment: comment,
        efileefileid: fileId
    }

    try {
        
        const result = await mobileCommentService.updateComment(parseInt(commentId), commentDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }

}

controller.getAllComments = async (req, res, next) => {

    const { page = '0', size = '10' } = req.query
    const { threadId } = req.params

    try {
        
        const pageObj = await mobileCommentService.getAllComments(parseInt(page), parseInt(size), parseInt(threadId), req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch (e) {
        next(e)
    }

}

controller.getCommentById = async (req, res, next) => {

    const { commentId } = req.params

    try {

        const result = await mobileCommentService.getCommentById(commentId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }

}

controller.deleteComment = async (req, res, next) => {

    const { commentId } = req.params

    try {
        
        const result = await mobileCommentService.deleteComment(parseInt(commentId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }

}

controller.getThreadDetailByCommentId = async (req, res, next) => {

    const { commentId } = req.params;

    try {

        const result = await mobileCommentService.getThreadDetailByCommentId(commentId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller