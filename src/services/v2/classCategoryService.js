const { NotFoundError } = require('../../models/errors');
const ClassCategory = require('../../models/v2/ClassCategory');
const classCategoryCoachService = require('./classCategoryCoachService');
const classCategorySessionService = require ('./classCategorySessionService');
const dayToCodeEnum = require('../../models/enum/DayToCodeEnum');
const codeToMonthEnum = require('../../models/enum/CodeToMonthEnum');

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
                    const categoryStartDate = new Date(category.startMonth);
                    let sessionStartDate = new Date(categoryStartDate.getFullYear(), categoryStartDate.getMonth(), dayToCodeEnum[session.day], session.startTime).getTime();
                    let sessionEndDate = new Date(categoryStartDate.getFullYear(), categoryStartDate.getMonth(), dayToCodeEnum[session.day], session.endTime).getTime();
                    // Loop to increase 7days per session from startDate to endDate
                    while (sessionStartDate < category.endMonth) {
                        let monthCode = new Date(sessionStartDate).getMonth();
                        sessionDTO.push({
                            classCategoryUuid: classCategory.uuid,
                            startDate: sessionStartDate,
                            endDate: sessionEndDate,
                            monthCode: monthCode,
                            monthName: codeToMonthEnum[monthCode],
                        });
                        sessionStartDate += oneWeek;
                        sessionEndDate += oneWeek;
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

classCategoryService.getClassCategoryPriceRangeByClassUuid = async (classUuid) => {

    const prices = await ClassCategory.query()
        .modify('price')
        .where('class_uuid', classUuid);

    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    for (let i=0;i<prices.length;i++) {
        const price = parseInt(prices[i].price);
        if (price < min)
            min = price;
        if (parseInt(price) > max)
            max = price;
    }

    return {
        minPrice: min,
        maxPrice: max,
    }

}

module.exports = classCategoryService;