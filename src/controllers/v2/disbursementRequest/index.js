const disbursementRequestService = require('../../../services/v2/disbursementRequestService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const disbursementRequestController = {};

disbursementRequestController.createDisbursementRequest = async (req, res, next) => {

    try {

        const result = await disbursementRequestService.createDisbursementRequest(req.user.sub);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

disbursementRequestController.withdrawnDisbursementRequest = async (req, res, next) => {

    const { disbursementRequestUuid } = req.body;

    try {

        const result = await disbursementRequestService.withdrawnDisbursementRequest(disbursementRequestUuid);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = disbursementRequestController;