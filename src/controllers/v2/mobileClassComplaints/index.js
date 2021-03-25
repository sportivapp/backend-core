const classComplaintsService = require('../../../services/v2/mobileClassComplaintsService');
const ResponseHelper = require('../../../helper/ResponseHelper');

mobileClassComplaintController = {};

mobileClassComplaintController.getMyComplaints = async (req, res, next) => {

    const { status } = req.query;

    try {

        const result = await classComplaintsService.getMyComplaints(req.user, status);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

mobileClassComplaintController.getCoachComplaints = async (req, res, next) => {

    const { status } = req.query;

    try {

        const result = await classComplaintsService.getCoachComplaints(req.user, status);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

mobileClassComplaintController.coachAcceptComplaint = async (req, res, next) => {

    const { classComplaintUuid } = req.params;

    try {

        const result = await classComplaintsService.coachAcceptComplaint(classComplaintUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

mobileClassComplaintController.coachRejectComplaint = async (req, res, next) => {

    const { classComplaintUuid } = req.params;
    const { coachReason, fileIds } = req.body;

    try {

        const result = await classComplaintsService.coachRejectComplaint(classComplaintUuid, coachReason, fileIds, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = mobileClassComplaintController;