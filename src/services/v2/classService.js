const Class = require('../../models/v2/Class');
const classMediaService = require('./classMediaService');
const classCoachService = require('./classCoachService');
const classCategoriesService = require('./classCategoryService');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const ServiceHelper = require('../../helper/ServiceHelper');
const classCategoryService = require('./classCategoryService');
const classCategoryParticipantService = require('./classCategoryParticipantService');

const ErrorEnum = {
    INVALID_COACH_ID: 'INVALID_COACH_ID',
    INVALID_START_SESSION_DATE: 'INVALID_START_SESSION_DATE',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
}

const classService = {};

classService.createClass = async (classDTO, fileIds, classCoachUserIds, categories, user) => {

    if (!user.companyId)
        throw new UnsupportedOperationError('USER_NOT_IN_COMPANY');

    categories.map(category => {
        category.categoryCoachUserIds.map(categoryUserId => {
            const foundClassCoach = classCoachUserIds.find(classUserId => classUserId === categoryUserId);
            if (!foundClassCoach)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_COACH_ID);
        });

    });

    return Class.transaction(async trx => {

        const cls = await Class.query(trx)
            .insertToTable(classDTO, user.sub);

        const mediaDTO = fileIds.map(fileId => {
            return {
                classUuid: cls.uuid,
                fileId: fileId,
            }
        });

        const classCoachDTO = classCoachUserIds.map(classCoachUserId => {
            return {
                classUuid: cls.uuid,
                userId: classCoachUserId,
            }
        });

        const classMedia = await classMediaService.initMedia(mediaDTO, user, trx);
        const classCoach = await classCoachService.initClassCoach(classCoachDTO, user, trx);
        const classCategory = await classCategoriesService.initCategories(cls.uuid, categories, user, trx);

        return {
            ...cls,
            classMedia: classMedia,
            classCoach: classCoach,
            classCategory: classCategory,
        };

    });

};

classService.getClasses = async (page, size, keyword, industryId) => {

    let clsPromise = Class.query()
        .modify('adminList')
        .whereRaw(`LOWER("title") LIKE LOWER('%${keyword}%')`)

    if (industryId)
        clsPromise = clsPromise.where('industry_id', industryId);

    const pageObj = await clsPromise.page(page, size)

    const resultPromise = pageObj.results.map(async cls => {
        return {
            ...cls,
            priceRange: await classCategoryService.getClassCategoryPriceRangeByClassUuid(cls.uuid),
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
        .modify('adminDetail')
        .findById(classUuid);

    const priceRange = await classCategoryService.getClassCategoryPriceRangeByClassUuid(cls.uuid);

    return {
        ...cls,
        priceRange: priceRange,
    }

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

classService.checkUserInClassCompany = async (classUuid, user) => {

    const cls = classService.findById(classUuid);
    if (cls.companyId !== user.companyId)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY);
        

}

classService.getClassCategory = async (classUuid, classCategoryUuid, user) => {

    await classService.checkUserInClassCompany(classUuid, user);
    return classCategoriesService.getClassCategory(classCategoryUuid);

}

classService.reschedule = async (classUuid, classCategorySessionDTO, user) => {

    await classService.checkUserInClassCompany(classUuid, user);
    return classCategoriesService.reschedule(classCategorySessionDTO, user)

}

classService.getClassParticipants = async (classUuid, classCategoryUuid, user) => {

    return classCategoryParticipantService.getClassParticipants(classUuid);

}

module.exports = classService;