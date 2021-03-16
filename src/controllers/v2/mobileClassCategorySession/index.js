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
    const { isCheckIn } = req.query;

    try {

        const result = await classCategorySessionService.getSessionParticipants(classCategoryUuid, classCategorySessionUuid, isCheckIn, req.user);
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

    const { classUuid, classCategoryUuid, classCategorySessionUuid } = req.params;
    const { rating, review, improvementCodes } = req.body;
    
    const classRatingsDTO = {
        classUuid: classUuid,
        classCategoryUuid: classCategoryUuid,
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

    const { classUuid, classCategoryUuid, classCategorySessionUuid } = req.params;
    const { reason } = req.body;
    
    const classReasonssDTO = {
        classUuid: classUuid,
        classCategoryUuid: classCategoryUuid,
        classCategorySessionUuid: classCategorySessionUuid,
        reason: reason,
    }

    try {

        const result = await classCategorySessionService.reason(classReasonssDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classCategorySessionController;