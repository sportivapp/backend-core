const classCategoryService = require('../../../services/v2/mobileClassCategoryService');
const ResponseHelper = require('../../../helper/ResponseHelper');
const classCategorySessionService = require('../../../services/v2/mobileClassCategorySessionService');

const classCategoryController = {};

classCategoryController.getCoachCategory = async (req, res, next) => {

    const { classCategoryUuid } = req.params;

    try {

        const result = await classCategoryService.getCoachCategory(classCategoryUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategoryController.startSession = async (req, res, next) => {

    const { classCategoryUuid, classCategorySessionUuid } = req.params;

    try {

        const result = await classCategoryService.startSession(classCategoryUuid, classCategorySessionUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

// Might be used later for getting participants by category, also by month, just add month params
classCategoryController.getParticipants = async (req, res, next) => {

    const { classCategoryUuid } = req.params;

    try {

        const result = await classCategoryService.getParticipants(classCategoryUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategoryController.getMyCategory = async (req, res, next) => {

    const { classCategoryUuid } = req.params;
    const { status } = req.query;

    try {

        const result = await classCategoryService.getMyCategory(classCategoryUuid, status, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategoryController.endSession = async (req, res, next) => {

    const { classCategoryUuid, classCategorySessionUuid } = req.params;

    try {

        const result = await classCategoryService.endSession(classCategoryUuid, classCategorySessionUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategoryController.reschedule = async (req, res, next) => {

    const { classCategoryUuid, classCategorySessionUuid } = req.params;
    const { startDate, endDate } = req.body;
    let { isRepeat } = req.query;
    isRepeat = (isRepeat === 'true');

    const classCategorySessionDTO = {
        uuid: classCategorySessionUuid,
        classCategoryUuid: classCategoryUuid,
        startDate: startDate,
        endDate: endDate,
    }

    try {

        const result = await classCategoryService.reschedule(classCategorySessionDTO, isRepeat, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategoryController.getMyUnconfirmedSessions = async (req, res, next) => {

    const { classCategoryUuid } = req.params;

    try {

        const result = await classCategoryService.getMyUnconfirmedSessions(classCategoryUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classCategoryController;