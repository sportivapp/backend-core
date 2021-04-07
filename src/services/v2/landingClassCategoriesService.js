const { NotFoundError, UnsupportedOperationError } = require('../../models/errors');
const ClassCategory = require('../../models/v2/ClassCategory');
const classCategorySessionService = require('./landingClassCategorySessionService');
const classCategoryCoachService = require('./landingClassCategoryCoachService');

const ErrorEnum = {
    CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
    NO_SESSIONS: 'NO_SESSIONS',
    PARTICIPANTS_EXISTED: 'PARTICIPANTS_EXISTED',
    COACHES_NOT_FOUND: 'COACHES_NOT_FOUND',
}

const classCategoryService = {};

classCategoryService.initCategories = async (categories, user, trx) => {

    const classCategoryPromises = categories.map(category => {
        const newCategory = {};
        newCategory.classUuid = category.classUuid;
        newCategory.title = category.title;
        newCategory.description = category.description;
        newCategory.price = category.price;
        newCategory.requirements = category.requirements;
        newCategory.isRecurring = category.isRecurring;
        newCategory.minParticipant = category.minParticipant;
        newCategory.maxParticipant = category.maxParticipant;

        return classCategories = ClassCategory.query(trx)
            .insertToTable(newCategory, user.sub)
            .then(async classCategory => {
                const categoryCoachDTO = {
                    classUuid: classCategory.classUuid,
                    classCategoryUuid: classCategory.uuid,
                    userId: user.sub,
                }

                if (category.sessions.length === 0)
                        throw new UnsupportedOperationError(ErrorEnum.NO_SESSIONS);

                const sessionsDTO = category.sessions.map(session => {
                    return {
                        ...session,
                        classUuid: classCategory.classUuid,
                        classCategoryUuid: classCategory.uuid,
                        initStartDate: session.startDate,
                        initEndDate: session.endDate,
                    }
                });
                
                const classCategorySession = await classCategorySessionService.initCategorySession(sessionsDTO, user, trx);
                const classCategoryCoach = await classCategoryCoachService.initCategoryCoach(categoryCoachDTO, user, trx);

                return {
                    ...classCategory,
                    classCategoryCoach: classCategoryCoach,
                    classCategorySession: classCategorySession,
                }
            });

    });
    return Promise.all(classCategoryPromises);

}

module.exports = classCategoryService;