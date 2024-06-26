const reportThreadService = require('../../services/reportThreadService');
const ResponseHelper = require('../../helper/ResponseHelper');

const reportThreadController = {};

reportThreadController.createReportThread = async (req, res, next) => {

    try {

        const { message, threadId, commentId, replyId, typeId } = req.body;

        const result = await reportThreadService.report(message, threadId, commentId, replyId, typeId, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

reportThreadController.getReportTypes = async (req, res, next) => {

    try {
        const list = await reportThreadService.getReportTypes();
        return res.status(200).json(ResponseHelper.toBaseResponse(list))
    } catch (e) {
        next(e)
    }
}

module.exports = reportThreadController;