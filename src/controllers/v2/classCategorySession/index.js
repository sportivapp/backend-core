const classCategorySessionService = require('../../../services/v2/classCategorySessionService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classCategorySessionController = {};

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

classCategorySessionController.getSessions = async (req, res, next) => {

    const { classCategoryUuid } = req.params;
    const { page = '0', size = '10' } = req.query;
    let { statuses } = req.query;

    try {

        if (typeof(statuses) === 'string')
            statuses = [statuses];

        const pageObj = await classCategorySessionService
            .getSessions(classCategoryUuid, statuses, parseInt(page), parseInt(size));
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

module.exports = classCategorySessionController;