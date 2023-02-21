const classComplaintsService = require('../../../services/v2/mobileClassComplaintsService');
const ResponseHelper = require('../../../helper/ResponseHelper');

mobileClassComplaintController = {};

mobileClassComplaintController.getMyCategoryComplaints = async (req, res, next) => {

    const { classCategoryUuid } = req.params;
    const { page = '0', size = '10', status } = req.query;

    try {

        const pageObj = await classComplaintsService
            .getMyCategoryComplaints(classCategoryUuid, parseInt(page), parseInt(size), status, req.user);
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

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