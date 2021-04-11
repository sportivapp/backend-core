const classCategorySessionService = require('../../../services/v2/commonClassCategorySessionService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classCategorySessionController = {};

classCategorySessionController.generateSessionsByCity = async (req, res, next) => {

    const { cityId, start, end, schedules } = req.body;

    try {

        const result = await classCategorySessionService.generateSessionsByCity(cityId, start, end, schedules);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classCategorySessionController;