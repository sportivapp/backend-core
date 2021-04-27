const classService = require('../../../services/v2/mobileClassService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classController = {};

classController.getClasses = async (req, res, next) => {

    const { page='0', size='10', keyword='', industryId, cityId, companyId } = req.query;

    try {

        const pageObj = await classService.getClasses(parseInt(page), parseInt(size), keyword, 
            parseInt(industryId), parseInt(cityId), parseInt(companyId));
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
    const { classCategorySessionUuids } = req.body;

    try {

        const result = await classService.register(classUuid, classCategoryUuid, classCategorySessionUuids, req.user);
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

classController.getCategories = async (req, res, next) => {

    const { classUuid } = req.params;

    try {

        const result = await classService.getCategories(classUuid);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getMyClassHistory = async (req, res, next) => {

    try {

        const result = await classService.getMyClassHistory(req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getCoachClassHistory = async (req, res, next) => {

    try {

        const result = await classService.getCoachClassHistory(req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.reportClass = async (req, res, next) => {

    const { classUuid } = req.params;
    const { code, report } = req.body;

    const classReportDTO = {
        code: code,
        report: report,
        classUuid: classUuid,
    }

    try {

        const result = await classService.reportClass(classUuid, classReportDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classController;