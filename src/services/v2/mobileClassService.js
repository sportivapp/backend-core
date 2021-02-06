const Class = require('../../models/v2/Class');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const ServiceHelper = require('../../helper/ServiceHelper');
const classCategoryService = require('./mobileClassCategoryService');

const ErrorEnum = {
    INVALID_COACH_ID: 'INVALID_COACH_ID',
    INVALID_START_SESSION_DATE: 'INVALID_START_SESSION_DATE',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
}

const classService = {};

classService.getClasses = async (page, size, keyword, industryId, cityId) => {

    let clsPromise = Class.query()
        .modify('adminList')
        .whereRaw(`LOWER("title") LIKE LOWER('%${keyword}%')`)

    if (industryId)
        clsPromise = clsPromise.where('industry_id', industryId);

    if (cityId)
        clsPromise = clsPromise.where('city_id', cityId);

    return clsPromise
        .page(page, size)
        .then(classes =>
            ServiceHelper.toPageObj(page, size, classes)
        );;

}

classService.getClass = async (classUuid) => {

    return Class.query()
        .modify('adminDetail')
        .findById(classUuid)
        .then(cls => {
            if (!cls)
                throw new NotFoundError();
            return cls;
        });

}

classService.findById = async (classUuid) => {

    return Class.query()
        .findById(classUuid)
        .then(cls => {
            if (!cls)
                throw new NotFoundError();
            return cls;
        });

}

classService.getClassCategory = async (classUuid, classCategoryUuid) => {

    return classCategoryService.getClassCategory(classCategoryUuid);

}

classService.register = async (classUuid, classCategoryUuid, user) => {

    return classCategoryService.register(classCategoryUuid, user);

}

module.exports = classService;