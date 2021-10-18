const classComplaintsService = require('../../../services/v2/classComplaintsService');
const ResponseHelper = require('../../../helper/ResponseHelper');

classComplaintController = {};

classComplaintController.coachAcceptComplaint = async (req, res, next) => {

    const { classComplaintUuid } = req.params;

    try {

        const result = await classComplaintsService.coachAcceptComplaint(classComplaintUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classComplaintController.coachRejectComplaint = async (req, res, next) => {

    const { classComplaintUuid } = req.params;
    const { coachReason, fileIds } = req.body;

    try {

        const result = await classComplaintsService.coachRejectComplaint(classComplaintUuid, coachReason, fileIds, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classComplaintController;