const ResponseHelper = require('../../helper/ResponseHelper')
const threadPostReplyService = require('../../services/threadPostReplyService')

const threadPostReplyController = {}

threadPostReplyController.getAllReplyByThreadPostId = async (req, res, next) => {

    const { commentId } = req.params

    try {
        const result = await threadPostReplyService.getAllByThreadPostId(commentId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

threadPostReplyController.createReply = async (req, res, next) => {

    const { commentId } = req.params

    const { comment, fileId } = req.body

    const replyDTO = {
        ethreadpostreplycomment: comment,
        efileefileid: fileId
    }

    try {
        const result = await threadPostReplyService.createReplyByThreadPostId(commentId, replyDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

threadPostReplyController.editReply = async (req, res, next) => {

    const { replyId } = req.params

    const { comment, fileId } = req.body

    const replyDTO = {
        ethreadpostreplycomment: comment,
        efileefileid: fileId
    }

    try {
        const result = await threadPostReplyService.editReplyById(replyId, replyDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

threadPostReplyController.deleteReply = async (req, res, next) => {

    const { replyId } = req.params

    try {
        const result = await threadPostReplyService.deleteReplyById(replyId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

module.exports = threadPostReplyController