const Class = require('../../models/v2/Class');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const ServiceHelper = require('../../helper/ServiceHelper');
const classCategoryService = require('./mobileClassCategoryService');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const classCategorySessionService = require('./mobileClassCategorySessionService');
const classTransactionService = require('./mobileClassTransactionService');
const coachCategoryService = require('./mobileClassCategoryCoachService');
const classTransactionDetailService = require('./mobileClassTransactionDetailService');
const classReportService = require('./mobileClassReportService');

const ErrorEnum = {
    INVALID_COACH_ID: 'INVALID_COACH_ID',
    INVALID_START_SESSION_DATE: 'INVALID_START_SESSION_DATE',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    INVALID_STATUS: 'INVALID_STATUS',
    SESSION_REGISTERED: 'SESSION_REGISTERED',
}

const classService = {};

classService.getPriceRange = async (classUuid) => {

    const result = await Class.query()
        .findById(classUuid)
        .modify('prices')
        .then(cls => {
            let lowestPrice = Number.MAX_VALUE;
            let highestPrice = Number.MIN_VALUE;
            cls.classCategories.map(category => {
                const categoryPriceInt = parseInt(category.price);
                if (categoryPriceInt < lowestPrice)
                    lowestPrice = categoryPriceInt;
                if (categoryPriceInt > highestPrice)
                    highestPrice = categoryPriceInt
                category.categorySessions.map(session => {
                    const sessionPriceInt = parseInt(session.price);
                    if (sessionPriceInt < lowestPrice)
                        lowestPrice = sessionPriceInt;
                    if (sessionPriceInt > highestPrice)
                        highestPrice = sessionPriceInt
                });
            });
            return {
                minPrice: lowestPrice,
                maxPrice: highestPrice
            };
        });

    return result;

}

classService.getClasses = async (page, size, keyword, industryId, cityId, companyId) => {

    let clsPromise = Class.query()
        .modify('adminList')
        .whereRaw(`LOWER("title") LIKE LOWER('%${keyword}%')`)

    if (industryId)
        clsPromise = clsPromise.where('industry_id', industryId);

    if (cityId)
        clsPromise = clsPromise.where('city_id', cityId);

    if (companyId)
        clsPromise = clsPromise.where('company_id', companyId);

    const pageObj = await clsPromise.page(page, size);

    const resultPromise = pageObj.results.map(async cls => {
        return {
            ...cls,
            priceRange: await classService.getPriceRange(cls.uuid),
            totalParticipants: await classCategoryParticipantSessionService.getTotalParticipantsByClassUuid(cls.uuid),
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
            cls.totalParticipants = await classCategoryParticipantSessionService.getTotalParticipantsByClassUuid(cls.uuid);
            cls.administrationFee = parseInt(cls.administrationFee);
            return cls;
        });

    const clsCategoriesPromise = cls.classCategories.map(async category => {
        category.totalParticipants = await classCategorySessionService.getTotalParticipantsByCategoryUuid(category.uuid);
        category.price = parseInt(category.price);
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
            cls.administrationFee = parseInt(cls.administrationFee);
            return cls;
        });

}

classService.getClassCategory = async (classUuid, classCategoryUuid, user) => {

    return classCategoryService.getClassCategory(classCategoryUuid, user);

}

classService.register = async (classUuid, classCategoryUuid, classCategorySessionUuids, paymentMethodCode, user) => {

    await classTransactionDetailService.checkUserRegisteredToSessions(classCategorySessionUuids, user.sub);
    const cls = await classService.findById(classUuid);
    const category = await classCategoryService.findById(classCategoryUuid);
    const sessions = await classCategorySessionService.findSessions(classCategorySessionUuids);

    return classTransactionService.generateTransaction(cls, category, sessions, paymentMethodCode, user);

}

classService.getMyClass = async (status, user) => {

    if (!sessionStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    const sessionUuids = await classCategoryParticipantSessionService.getMySessionUuids(user);
    if (sessionUuids.length === 0)
        return [];

    const classes = await classCategorySessionService
        .getActiveClosestSessionsByStatusAndGroupByCategory(sessionUuids, status)
        .then(sessions => {
            const promises = sessions.map(session => {
                return Class.query()
                    .modify('myClass', session.uuid)
                    .first()
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
            category.totalParticipants = await classCategorySessionService.getTotalParticipantsByCategoryUuid(category.uuid);
            category.categorySession = category.categorySessions[0];
            delete category.categorySessions;
            return category;
        });
        await Promise.all(categoriesPromises);
        return cls;
    });

    return Promise.all(classPromises);

}

classService.getCategories = async (classUuid) => {

    return Class.query()
        .modify('categoriesTitleWithRating')
        .findById(classUuid);

}

classService.getMyClassHistory = async (user) => {

    return Class.query()
        .modify('myClassHistory', user.sub)
        .then(classes => classes.filter(cls => {
            let isDone = true;
            cls.classCategories.forEach(category => {
                category.categorySessions.forEach(session => {
                    if (session.status !== sessionStatusEnum.DONE) {
                        isDone = false;
                        return;
                    }
                });
                category.categorySession = category.categorySessions[0];
                delete category.categorySessions;
            });
            return isDone;
        }));

}

classService.getCoachClassHistory = async (user) => {

    const classUuids = await coachCategoryService.getCoachClassUuidsByUserId(user.sub);

    return Class.query()
        .modify('coachClassHistory')
        .whereIn('uuid', classUuids)
        .then(classes => classes.filter(cls => {
            let isDone = true;
            cls.classCategories.forEach(category => {
                category.categorySessions.forEach(session => {
                    if (session.status !== sessionStatusEnum.DONE) {
                        isDone = false;
                        return;
                    }
                });
                category.categorySession = category.categorySessions[0];
                delete category.categorySessions;
            });
            return isDone;
        }));
        
}

classService.reportClass = async (classUuid, classReportDTO, user) => {

    const cls = await classService.findById(classUuid);

    classReportDTO.userName = user.name;
    classReportDTO.classTitle = cls.title;

    return classReportService.reportClass(cls, classReportDTO, user);

}

module.exports = classService;