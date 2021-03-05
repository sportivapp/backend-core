const classService = require('../../../services/v2/mobileClassService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classController = {};

classController.getClasses = async (req, res, next) => {

    const { page='0', size='10', keyword='', industryId=1, cityId=1 } = req.query;

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

        const result = await classService.getClass(classUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getClassCategory = async (req, res, next) => {

    const { classUuid, classCategoryUuid } = req.params;

    try {

        const result = await classService.getClassCategory(classUuid, classCategoryUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.register = async (req, res, next) => {

    const { classUuid, classCategoryUuid } = req.params;

    try {

        const result = await classService.register(classUuid, classCategoryUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getMyClass = async (req, res, next) => {

    const { status } = req.query;

    try {

        const result = await classService.getMyClass(status, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getCoachClass = async (req, res, next) => {

    const { status } = req.query;

    try {

        const result = await classService.getCoachClass(status, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classController;