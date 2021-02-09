const { NotFoundError } = require('../../models/errors');
const ClassCategory = require('../../models/v2/ClassCategory');
const classCategoryCoachService = require('./classCategoryCoachService');
const classCategorySessionService = require ('./classCategorySessionService');

const classCategoryService = {};

const oneWeek = 7 * 24 * 60 * 60 * 1000;

classCategoryService.initCategories = async (classId, categories, user, trx) => {

    const classCategoryPromises = categories.map(category => {
        const newCategory = {};
        newCategory.classUuid = classId;
        newCategory.title = category.title;
        newCategory.description = category.description;
        newCategory.price = category.price;
        newCategory.requirements = JSON.stringify(category.requirements);

        return classCategories = ClassCategory.query(trx)
            .insertToTable(newCategory, user.sub)
            .then(async classCategory => {
                const categoryCoachDTO = category.categoryCoachUserIds.map(categoryCoachUserId => {
                    return {
                        classCategoryUuid: classCategory.uuid,
                        userId: categoryCoachUserId,
                    }
                });
                let sessionDTO = [];
                category.schedules.map(session => {    
                    while (session.startDate < category.endDate) {
                        sessionDTO.push({
                            classCategoryUuid: classCategory.uuid,
                            startDate: session.startDate,
                            endDate: session.endDate,
                        });
                        session.startDate += oneWeek;
                        session.endDate += oneWeek;
                    }
                });
                const classCategoryCoach = await classCategoryCoachService.initCategoryCoach(categoryCoachDTO, user, trx);
                const classCategorySession = await classCategorySessionService.initCategorySession(sessionDTO, user, trx);

                return {
                    ...classCategory,
                    classCategoryCoach: classCategoryCoach,
                    classCategorySession: classCategorySession,
                }
            });

    });
    return Promise.all(classCategoryPromises);

}

classCategoryService.getClassCategory = async (classCategoryUuid) => {

    return ClassCategory.query()
        .modify('detail')
        .findById(classCategoryUuid)
        .then(classCategory => {
            if (!classCategory)
                throw new NotFoundError();
            return classCategory;
        })

}

classCategoryService.reschedule = async (classCategorySessionDTO, user) => {

    return classCategorySessionService.reschedule(classCategorySessionDTO, user);

}

module.exports = classCategoryService;