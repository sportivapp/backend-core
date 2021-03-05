const Class = require('../../models/v2/Class');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const ServiceHelper = require('../../helper/ServiceHelper');
const classCategoryService = require('./mobileClassCategoryService');
const classCategoryParticipantService = require('./mobileClassCategoryParticipantService');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');

const ErrorEnum = {
    INVALID_COACH_ID: 'INVALID_COACH_ID',
    INVALID_START_SESSION_DATE: 'INVALID_START_SESSION_DATE',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    INVALID_STATUS: 'INVALID_STATUS',
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

    const pageObj = await clsPromise.page(page, size);

    const resultPromise = pageObj.results.map(async cls => {
        return {
            ...cls,
            priceRange: await classCategoryService.getClassCategoryPriceRangeByClassUuid(cls.uuid),
            totalParticipants: await classCategoryParticipantService.getParticipantsCountByClassUuid(cls.uuid),
        }
    });
    
    return Promise.all(resultPromise)
        .then(cList => {
            pageObj.results = cList.map(cls => {
                cls.administrationFee = parseInt(cls.administrationFee);
                return cls;
            });
            return pageObj;
        })
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));

}

classService.getClass = async (classUuid, user) => {

    const cls = await Class.query()
        .modify('userDetail')
        .findById(classUuid)
        .then(async cls => {
            if (!cls)
                throw new NotFoundError();
            cls.administrationFee = parseInt(cls.administrationFee);
            return cls;
        });

    const clsCategoriesPromise = cls.classCategories.map(async category => {
        category.price = parseInt(category.price);
        const totalParticipants = await classCategoryParticipantService
            .getParticipantsCountByClassCategoryUuid(category.uuid);
        category.totalParticipants = totalParticipants;
    })

    await Promise.all(clsCategoriesPromise);
    cls.totalParticipants = await classCategoryParticipantService.getParticipantsCountByClassUuid(cls.uuid);
    cls.wasRegistered = await classCategoryParticipantService.isUserRegisteredInClass(cls.uuid, user.sub);

    return cls;

}

classService.findById = async (classUuid) => {

    return Class.query()
        .findById(classUuid)
        .then(cls => {
            if (!cls)
                throw new NotFoundError();
            cls.administrationFee = parseInt(cls.administrationFee);
            return cls;
        });

}

classService.getClassCategory = async (classUuid, classCategoryUuid, user) => {

    return classCategoryService.getClassCategory(classCategoryUuid, user);

}

classService.register = async (classUuid, classCategoryUuid, user) => {

    return classCategoryParticipantService.register(classUuid, classCategoryUuid, user);

}

classService.getMyClass = async (status, user) => {

    if (!sessionStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    let classes = await classCategoryParticipantService.getActiveParticipantsByUserIdGroupByCategory(user.sub)
        .then(participants => {
            const promises = participants.map(participant => {
                return Class.query()
                    .modify('myClass', participant, status)
                        .first()
                        .then(cls => {
                            if (cls) cls.administrationFee = parseInt(cls.administrationFee);
                            return cls;
                        });
            });
            // Remove nulls
            // Why null happen? because when status defined as ONGOING and there is no ONGOING session, session would be null.
            // Or there is no sessions left for the user on their active month.
            return Promise.all(promises)
                .then(cList => cList.filter(cls => !!cls));
        });

    return classService.groupClassesByCategoryReplaceSessionsToSession(classes); 

}

classService.getCoachClass = async (status, user) => {

    if (!sessionStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    const classes = await Class.query()
        .modify('coachClass', user.sub, status);

    return classService.groupClassesByCategoryReplaceSessionsToSession(classes);
}

classService.groupClassesByCategoryReplaceSessionsToSession = async (classes) => {

    const classPromises = classes.map(async cls => {
        const categoriesPromises = cls.classCategories.map(async category => {
            category.categorySession = category.categorySessions[0];
            delete category.categorySessions;
            category.categorySession.totalParticipants = await classCategoryParticipantSessionService
                .getParticipantsCountBySessionUuid(category.categorySession.uuid);
            return category;
        });
        await Promise.all(categoriesPromises);
        return cls;
    });

    return Promise.all(classPromises);

}

module.exports = classService;