const classCategoryService = require('../../../services/v2/classCategoryService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classCategoryController = {};

classCategoryController.getSchedules = async (req, res, next) => {

    const { classCategoryUuid } = req.params;

    try {

        const result = await classCategoryService.getSchedules(classCategoryUuid);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classCategoryController.extend = async (req, res, next) => {

    const { classCategoryUuid } = req.params;

    const { startMonth, endMonth, schedules } = req.body;
    const extendCategoryDTO = {
        uuid: classCategoryUuid,
        startMonth: startMonth,
        endMonth: endMonth,
        schedules: schedules,
    }

    try {

        const result = await classCategoryService.extendSchedule(extendCategoryDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classCategoryController;