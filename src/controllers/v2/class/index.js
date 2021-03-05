const classService = require('../../../services/v2/classService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const classController = {};

classController.createClass = async (req, res, next) => {

    const { title, description, address, cityId, industryId, picId, picMobileNumber, administrationFee, stateId, addressName } = req.body;
    const { fileIds } = req.body;
    const { classCoachUserIds } = req.body;
    const { categories } = req.body;

    const classDTO = {
        title: title,
        description: description,
        address: address,
        cityId: cityId,
        industryId: industryId,
        picId: picId,
        picMobileNumber: picMobileNumber,
        companyId: req.user.companyId,
        administrationFee: administrationFee,
        stateId: stateId,
        addressName: addressName,
    };

    try {

        const result = await classService.createClass(classDTO, fileIds, classCoachUserIds, categories, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getClasses = async (req, res, next) => {

    const { page='0', size='10', keyword='', industryId } = req.query;

    try {

        const pageObj = await classService.getClasses(parseInt(page), parseInt(size), keyword, parseInt(industryId), req.user);
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

classController.deleteClass = async (req, res, next) => {

    const { classUuid } = req.params;

    try {

        const result = await classService.deleteClass(classUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.reschedule = async (req, res, next) => {

    const { classUuid, classCategoryUuid, classCategorySessionUuid } = req.params;
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

        const result = await classService.reschedule(classUuid, classCategorySessionDTO, isRepeat, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getClassParticipants = async (req, res, next) => {

    const { classUuid } = req.params;

    try {

        const result = await classService.getClassParticipants(classUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getClassCoaches = async (req, res, next) => {

    const { classUuid } = req.params;

    try {

        const result = await classService.getClassCoaches(classUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.updateCategory = async (req, res, next) => {

    const { classUuid, classCategoryUuid } = req.params;
    const { title, description, categoryCoachUserIds, price, requirements } = req.body;

    const categoryDTO = {
        classUuid: classUuid,
        uuid: classCategoryUuid,
        title: title,
        description: description,
        categoryCoachUserIds: categoryCoachUserIds,
        price: price,
        requirements: requirements,
    };

    try {

        const result = await classService.updateCategory(categoryDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.deleteCategory = async (req, res, next) => {

    const { classUuid, classCategoryUuid } = req.params;

    try {

        const result = await classService.deleteCategory(classUuid, classCategoryUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.addCategory = async (req, res, next) => {

    const { classUuid } = req.params;
    const { startMonth, endMonth, title, description, categoryCoachUserIds, price, requirements, schedules } = req.body;

    const category = {
        classUuid: classUuid,
        title: title,
        description: description,
        categoryCoachUserIds: categoryCoachUserIds,
        price: price,
        requirements: requirements,
        schedules: schedules,
    };

    try {

        const result = await classService.addCategory(startMonth, endMonth, category, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.updateClass = async (req, res, next) => {

    const { classUuid } = req.params;
    const { title, description, address, addressName, picId, picMobileNumber, administrationFee, fileIds, classCoachUserIds } = req.body;

    const classDTO = {
        uuid: classUuid,
        title: title,
        description: description,
        address: address,
        addressName: addressName,
        picId: picId,
        picMobileNumber: picMobileNumber,
        administrationFee: administrationFee,
        fileIds: fileIds,
        classCoachUserIds: classCoachUserIds,
    };

    try {

        const result = await classService.updateClass(classDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getClassParticipants = async (req, res, next) => {

    const { classUuid } = req.params;

    try {

        const result = await classService.getClassParticipants(classUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = classController;