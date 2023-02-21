const classService = require('../../../services/v2/landingClassService');
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

classController.createClass = async (req, res, next) => {

    const { title, description, address, cityId, industryId, picId, picMobileNumber, administrationFee, stateId, addressName } = req.body;
    const { fileIds, categories } = req.body;

    const classDTO = {
        title: title,
        description: description,
        address: address,
        cityId: cityId,
        industryId: industryId,
        picId: picId,
        picMobileNumber: picMobileNumber,
        administrationFee: administrationFee,
        stateId: stateId,
        addressName: addressName,
    };

    try {

        const result = await classService.createClass(classDTO, fileIds, categories, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.getMyCreatedClasses = async (req, res, next) => {

    const { page='0', size='10', keyword='' } = req.query;

    try {

        const pageObj = await classService.getMyCreatedClasses(parseInt(page), parseInt(size), keyword, req.user);
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

classController.getLandingClassDetail = async (req, res, next) => {

    const { classUuid } = req.params;

    try {

        const result = await classService.getLandingClassDetail(classUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

classController.updateClass = async (req, res, next) => {

    const { classUuid } = req.params;
    const { description, address, addressName, administrationFee, fileIds } = req.body;

    const classDTO = {
        uuid: classUuid,
        description: description,
        address: address,
        addressName: addressName,
        administrationFee: administrationFee,
        fileIds: fileIds
    };

    try {

        const result = await classService.updateClass(classDTO, req.user);
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

classController.addCategory = async (req, res, next) => {

    const { classUuid } = req.params;
    const { title, description, requirements, isRecurring, price, minParticipants, maxParticipants, sessions } = req.body;

    const category = {
        classUuid: classUuid,
        title: title,
        description: description,
        requirements: requirements,
        iSRecurring: isRecurring,
        price: price,
        minParticipants: minParticipants,
        maxParticipants: maxParticipants,
        sessions: sessions,
    };

    try {

        const result = await classService.addCategory(category, req.user);
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

classController.checkIsClassOwner = async (req, res, next) => {

    const { classUuid } = req.params;

    try {
        const result = await classService.checkIsClassOwner(classUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

module.exports = classController;