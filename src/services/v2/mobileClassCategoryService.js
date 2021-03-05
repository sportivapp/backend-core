const ClassCategory = require('../../models/v2/ClassCategory');
const classCategoryCoachService = require('./mobileClassCategoryCoachService');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const classCategorySessionService = require('./mobileClassCategorySessionService');
const codeToDayEnum = require('../../models/enum/CodeToDayEnum');
const classCategoryParticipantService = require('./mobileClassCategoryParticipantService');
const codeToMonthEnum = require('../../models/enum/CodeToMonthEnum');

const ErrorEnum = {
    INVALID_STATUS: 'INVALID_STATUS',
}

const classCategoryService = {};

classCategoryService.groupSessions = (sessions) => {

    const grouped = [];
    
    let mappedMonthCode = {};
    let mappedDayCode = {};
    let monthIndex = 0;
    let dayIndex = 0;
    sessions.forEach(session => {
        const startDate = new Date(parseInt(session.startDate));
        const monthCode = startDate.getMonth();
        const month = codeToMonthEnum[monthCode];
        const dayCode = startDate.getDay();
        const day = codeToDayEnum[dayCode];
        if (grouped[mappedMonthCode[monthCode]]) {
            if (grouped[mappedMonthCode[monthCode]].days[mappedDayCode[dayCode]]) {
                grouped[mappedMonthCode[monthCode]].days[mappedDayCode[dayCode]].sessions.push(session);
            } else {
                if (mappedDayCode[dayCode] || mappedDayCode[dayCode] === undefined) {
                    mappedDayCode[dayCode] = dayIndex;
                    dayIndex++;
                }

                grouped[mappedMonthCode[monthCode]].days[mappedDayCode[dayCode]] = {
                    name: day,
                    sessions: [session],
                }
            }
        } else {
            if (mappedDayCode[dayCode] || mappedDayCode[dayCode] === undefined) {
                mappedDayCode[dayCode] = dayIndex;
                dayIndex++;
            }
            mappedMonthCode[monthCode] = monthIndex;
            monthIndex++;
            
            grouped[mappedMonthCode[monthCode]] = {
                name: month,
                days: [],
            }
            grouped[mappedMonthCode[monthCode]].days[mappedDayCode[dayCode]] = {
                name: day,
                sessions: [session],
            };
        }
    });

    return grouped;
}

classCategoryService.getClassCategory = async (classCategoryUuid, user) => {

    const classCategory = await ClassCategory.query()
        .modify('userDetail')
        .findById(classCategoryUuid)
        .then(classCategory => {
            if (!classCategory)
                throw new NotFoundError();
            classCategory.price = parseInt(classCategory.price);
            return classCategory;
        })

    const isCoach = await classCategoryCoachService.checkCoachCategory(user.sub, classCategoryUuid);
    classCategory.categorySessions = classCategoryService.groupSessions(classCategory.categorySessions);
    classCategory.isCoach = !!isCoach;

    return classCategory;

}

classCategoryService.getClassCategoryPriceRangeByClassUuid = async (classUuid) => {

    const prices = await ClassCategory.query()
        .modify('price')
        .where('class_uuid', classUuid)
        .then(prices => prices.map(price => parseInt(price.price)));

    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    prices.forEach(price => {
        if (price < min)
            min = price;
        if (price > max)
            max = price;
    })

    return {
        minPrice: min,
        maxPrice: max,
    }

}

classCategoryService.getCoachCategory = async (classCategoryUuid, user) => {

    await classCategoryCoachService.checkCoachCategory(user.sub, classCategoryUuid);

    let category = await ClassCategory.query()
        .modify('coachCategory')
        .findById(classCategoryUuid);

    category.upcomingSessions = category.upcomingSessions.map((session, index) => {

        let isToday = false;
        // Only for the first upcoming session
        if (index === 0) {
            isToday = new Date(parseInt(session.startDate)).getDate === new Date().getDate();
        }

        return {
            ...session,
            isStartable: isToday && category.ongoingSessions.length === 0,
        }

    });

    return category;

}

classCategoryService.startSession = async (classCategoryUuid, classCategorySessionUuid, user) => {

    await classCategoryCoachService.checkCoachCategory(user.sub, classCategoryUuid);
    return classCategorySessionService.startSession(classCategorySessionUuid, user);

}

classCategoryService.getParticipants = async (classCategoryUuid) => {

    return classCategoryParticipantService.getParticipants(classCategoryUuid);

}

classCategoryService.getMyCategory = async (classCategoryUuid, status, user) => {

    if (!sessionStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    const participant = await classCategoryParticipantService
        .getActiveParticipantByCategoryUuidAndUserId(classCategoryUuid, user.sub);

    return ClassCategory.query()
        .findById(classCategoryUuid)
        .modify('myCategory', participant, status)
        .then(classCategory => {
            if (!classCategory)
                throw new NotFoundError();
            classCategory.price = parseInt(classCategory.price);
            return classCategory;
        });

}

classCategoryService.endSession = async (classCategoryUuid, classCategorySessionUuid, user) => {

    await classCategoryCoachService.checkCoachCategory(user.sub, classCategoryUuid);
    const endedSession = await classCategorySessionService.endSession(classCategorySessionUuid, user);

    const upcomingSessions = await classCategorySessionService
        .getSessionByCategoryUuidAndStatus(session.classCategoryUuid, sessionStatusEnum.UPCOMING);

    let onHold = false;
    if (upcomingSessions.length === 0)
        onHold = true;

    await ClassCategory.query()
        .updateByUserId({
            onHold: onHold,
        }, user.sub);

    return endedSession;

}

module.exports = classCategoryService;