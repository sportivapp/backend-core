const Class = require('../../models/v2/Class');
const classMediaService = require('./classMediaService');
const classCoachService = require('./classCoachService');
const classCategoriesService = require('./classCategoryService');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const ServiceHelper = require('../../helper/ServiceHelper');

const ErrorEnum = {
    INVALID_COACH_ID: 'INVALID_COACH_ID',
    INVALID_START_SESSION_DATE: 'INVALID_START_SESSION_DATE',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
}

const classService = {};

classService.createClass = async (classDTO, fileIds, classCoachUserIds, categories, user) => {

    categories.map(category => {
        category.categoryCoachUserIds.map(categoryUserId => {
            const foundClassCoach = classCoachUserIds.find(classUserId => classUserId === categoryUserId);
            if (!foundClassCoach)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_COACH_ID);
        });

        const startDate = new Date(category.startDate);
        const firstSessionDate = new Date(category.sessions[0].startDate);

        if (startDate.getDay() !== firstSessionDate.getDay())
            throw new UnsupportedOperationError(ErrorEnum.INVALID_START_SESSION_DATE);

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

module.exports = classService;