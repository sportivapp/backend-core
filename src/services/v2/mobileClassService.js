const Class = require('../../models/v2/Class');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const ServiceHelper = require('../../helper/ServiceHelper');
const classCategoryService = require('./mobileClassCategoryService');
const classCategoryParticipantService = require('./mobileClassCategoryParticipantService');

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

    const pageObj = await clsPromise.page(page, size)

    const resultPromise = pageObj.results.map(async cls => {
        return {
            ...cls,
            priceRange: await classCategoryService.getClassCategoryPriceRangeByClassUuid(cls.uuid),
            totalParticipants: await classCategoryParticipantService.getParticipantsCountByClassUuid(cls.uuid),
        }
    });
    
    return Promise.all(resultPromise)
        .then(cList => {
            pageObj.results = cList;
            return pageObj;
        })
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));

}

classService.getClass = async (classUuid) => {

    const cls = await Class.query()
        .modify('userDetail')
        .findById(classUuid)
        .then(async cls => {
            if (!cls)
                throw NotFoundError();
            return cls;
        });

    const clsCategoriesPromise = cls.classCategories.map(async category => {
        const totalParticipants = await classCategoryParticipantService
            .getParticipantsCountByClassCategoryUuid(category.uuid);
        category.totalParticipants = totalParticipants;
    })

    await Promise.all(clsCategoriesPromise);

    return cls;

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

    return classCategoryParticipantService.register(classUuid, classCategoryUuid, user);

}

module.exports = classService;