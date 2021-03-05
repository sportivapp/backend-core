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

module.exports = classCategorySessionController;