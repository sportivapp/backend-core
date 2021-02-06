const classService = require('../../../services/v2/mobileClassService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classController = {};

classController.getClasses = async (req, res, next) => {

    const { page='0', size='10', keyword='', industryId, cityId } = req.query;

    try {

        const pageObj = await classService.getClasses(parseInt(page), parseInt(size), keyword, parseInt(industryId), parseInt(cityId));
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

classController.getClass = async (req, res, next) => {

    const { classUuid } = req.params;

    try {

        const result = await classService.getClass(classUuid);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getClassCategory = async (req, res, next) => {

    const { classUuid, classCategoryUuid } = req.params;

    try {

        const result = await classService.getClassCategory(classUuid, classCategoryUuid);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.register = async (req, res, next) => {

    const { classUuid, classCategoryUuid } = req.params;

    try {

        const result = await classService.register(classUuid, classCategoryUuid);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classController;