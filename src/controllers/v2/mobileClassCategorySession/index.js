const classCategorySessionService = require('../../../services/v2/mobileClassCategorySessionService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classCategorySessionController = {};

classCategorySessionController.inputAbsence = async (req, res, next) => {

    const { classCategoryUuid, classCategorySessionUuid } = req.params;
    const { participants } = req.body;

    try {

        const result = await classCategorySessionService.inputAbsence(classCategoryUuid, classCategorySessionUuid, participants, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.getSessionParticipants = async (req, res, next) => {

    const { classCategoryUuid, classCategorySessionUuid } = req.params;

    try {

        const result = await classCategorySessionService.getSessionParticipants(classCategoryUuid, classCategorySessionUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.confirmParticipation = async (req, res, next) => {

    const { classCategorySessionUuid, classCategoryParticipantSessionUuid } = req.params;
    const { isConfirm } = req.query;

    try {

        const result = await classCategorySessionService
            .confirmParticipation(classCategorySessionUuid, classCategoryParticipantSessionUuid, isConfirm, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.rate = async (req, res, next) => {

    const { classCategorySessionUuid } = req.params;
    const { rating, review, improvementCodes } = req.body;
    
    const classRatingsDTO = {
        classCategorySessionUuid: classCategorySessionUuid,
        rating: rating,
        review: review,
    }

    try {

        const result = await classCategorySessionService.rate(classRatingsDTO, improvementCodes, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.reason = async (req, res, next) => {

    const { classCategorySessionUuid } = req.params;
    const { reason } = req.body;
    
    const classReasonsDTO = {
        classCategorySessionUuid: classCategorySessionUuid,
        reason: reason,
    }

    try {

        const result = await classCategorySessionService.reason(classReasonsDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.complaintSession = async (req, res, next) => {

    const { classCategorySessionUuid } = req.params;
    const { complaint, complaintCode } = req.body;
    
    const classComplaintsDTO = {
        classCategorySessionUuid: classCategorySessionUuid,
        complaint: complaint,
        code: complaintCode,
    }

    try {

        const result = await classCategorySessionService.complaintSession(classComplaintsDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.sessionParticipantsHistory = async (req, res, next) => {

    const { classCategorySessionUuid } = req.params;

    try {

        const result = await classCategorySessionService.sessionParticipantsHistoryBySessionUuid(classCategorySessionUuid);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.getFinishedSessions = async (req, res, next) => {

    const { classCategoryUuid } = req.params;
    const { page = '0', size = '10' } = req.query;

    try {

        const result = await classCategorySessionService.getFinishedSessions(classCategoryUuid, parseInt(page), parseInt(size));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.getUpcomingSessions = async (req, res, next) => {

    const { classCategoryUuid } = req.params;
    const { page = '0', size = '10' } = req.query;

    try {

        const result = await classCategorySessionService.getUpcomingSessions(classCategoryUuid, parseInt(page), parseInt(size));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategorySessionController.getMyParticipantsHistory = async (req, res, next) => {

    const { classCategorySessionUuid } = req.params;

    try {

        const result = await classCategorySessionService.getMyParticipantsHistory(classCategorySessionUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classCategorySessionController;