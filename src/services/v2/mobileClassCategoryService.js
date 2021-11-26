const ClassCategory = require('../../models/v2/ClassCategory');
const classCategoryCoachService = require('./mobileClassCategoryCoachService');
const { UnsupportedOperationError, NotFoundError } = require('../../models/errors');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const classCategorySessionService = require('./mobileClassCategorySessionService');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const classComplaintService = require('./mobileClassComplaintsService');

const ErrorEnum = {
    INVALID_STATUS: 'INVALID_STATUS',
    CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
}

const classCategoryService = {};

classCategoryService.getClassCategory = async (categoryUuid, user) => {

    const category = await ClassCategory.query()
        .modify('userDetail')
        .findById(categoryUuid)
        .then(async category => {
            if (!category)
                throw new NotFoundError();
                category.totalParticipants = await classCategorySessionService.getTotalParticipantsByCategoryUuid(category.uuid);
                if (category.price === null || category.price === undefined) {
                    category.price = await classCategorySessionService.getLowestSessionPrice(category.uuid);
                } else {
                    category.price = parseInt(category.price);
                }
            return category;
        })

    const isCoach = await classCategoryCoachService.getCoachCategory(user.sub, categoryUuid);
    category.categorySessions = classCategorySessionService.groupSessions(category.categorySessions);
    category.isCoach = !!isCoach;

    return category;

}

// Fooked, useless, using getPriceRange on classService now
// classCategoryService.getClassCategoryPriceRangeByClassUuid = async (classUuid) => {

//     const prices = await ClassCategory.query()
//         .modify('price')
//         .where('class_uuid', classUuid)
//         .then(prices => prices.map(price => parseInt(price.price)));

//     let min = Number.MAX_SAFE_INTEGER;
//     let max = Number.MIN_SAFE_INTEGER;

//     prices.forEach(price => {
//         if (price < min)
//             min = price;
//         if (price > max)
//             max = price;
//         if (min === Number.MAX_SAFE_INTEGER && max === Number.MIN_SAFE_INTEGER) {
//             min = 0;
//             max = 0;
//         }
//     })

//     return {
//         minPrice: min,
//         maxPrice: max,
//     }

// }

classCategoryService.getCoachCategory = async (classCategoryUuid, user) => {

    await classCategoryCoachService.checkCoachCategory(user.sub, classCategoryUuid);

    let category = await ClassCategory.query()
        .modify('coachCategory')
        .findById(classCategoryUuid);

    category.upcomingSessions = category.upcomingSessions.map((session, index) => {

        let isToday = false;
        // Only for the first upcoming session
        if (index === 0) {
            let sessionStart = new Date(parseInt(session.startDate));
            // add 7 hours because we are fixed to utc + 7
            // TODO: use timezone offset
            sessionStart.setTime(sessionStart.getTime() + (7*60*60*1000));
            const todayDate = new Date().getDate();
            isToday = sessionStart.getDate() === todayDate;
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

classCategoryService.getMyCategory = async (classCategoryUuid, status, user) => {

    if (!sessionStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    const sessionUuids = await classCategorySessionService.getMySessionUuidsByCategoryUuid(classCategoryUuid, status, user);
    if (sessionUuids.length === 0)
        return {};

    return ClassCategory.query()
        .findById(classCategoryUuid)
        .modify('myCategory', user.sub, sessionUuids)
        .then(classCategory => {
            if (!classCategory)
                throw new NotFoundError();
            return classCategory;
        });

}

classCategoryService.endSession = async (classCategoryUuid, classCategorySessionUuid, user) => {

    await classCategoryCoachService.checkCoachCategory(user.sub, classCategoryUuid);

    return ClassCategory.transaction(async trx => {

        const upcomingSessions = await classCategorySessionService
            .getUpcomingSessions(classCategoryUuid, sessionStatusEnum.UPCOMING);

        let onHold = false;
        if (upcomingSessions.length === 0)
            onHold = true;

        await ClassCategory.query(trx)
            .updateByUserId({
                onHold: onHold,
            }, user.sub);

        return classCategorySessionService.endSession(classCategorySessionUuid, user, trx);

    });

}

classCategoryService.reschedule = async (classCategorySessionDTO, isRepeat, user) => {

    await classCategoryCoachService.checkCoachCategory(user.sub, classCategorySessionDTO.classCategoryUuid);
    return classCategorySessionService.reschedule(classCategorySessionDTO, isRepeat, user);
}

classCategoryService.getMyUnconfirmedSessions = async (classCategoryUuid, user) => {

    return classCategoryParticipantSessionService.getMyUnconfirmedSessions(classCategoryUuid, user);

}

classCategoryService.findById = async (classCategoryUuid) => {

    return ClassCategory.query()
        .findById(classCategoryUuid)
        .then(category => {
            if (!category)
                throw new UnsupportedOperationError(ErrorEnum.CATEGORY_NOT_FOUND);
            return category;
        })

}

classCategoryService.getBookableSessions = async (classCategoryUuid, year, user) => {

    const category = await ClassCategory.query()
        .modify('book')
        .findById(classCategoryUuid)
        .then(category => {
            if (!category)
                throw new UnsupportedOperationError(ErrorEnum.CATEGORY_NOT_FOUND);
            category.price = parseInt(category.price);
            return category;
        });

    let bookableSessions = await classCategorySessionService
        .getBookableSessions(classCategoryUuid, year, user.sub);

    if (category.isRecurring)
        bookableSessions = classCategorySessionService.groupOrderedRecurringSessions(bookableSessions);
    else
        bookableSessions = classCategorySessionService.groupOrderedNonRecurringSessions(bookableSessions);

    return {
        ...category,
        categorySessions: bookableSessions,
    }

}

classCategoryService.mySessionsHistory = async (classCategoryUuid, user) => {

    const categoryDetailWithInvoices = await ClassCategory.query()
        .findById(classCategoryUuid)
        .modify('categoryDetailWithInvoices', user.sub);

    const sessions = await classCategoryParticipantSessionService
        .mySessionsHistoryByCategoryUuidAndUserId(classCategoryUuid, user.sub);

    return {
        ...categoryDetailWithInvoices,
        sessions: sessions,
    }

}

classCategoryService.categorySessionsHistory = async (classCategoryUuid) => {

    return classCategoryParticipantSessionService
        .categorySessionsHistoryByCategoryUuid(classCategoryUuid);

}

classCategoryService.getCategoryComplaints = async (classCategoryUuid, status, user) => {

    return classComplaintService.getCategoryComplaints(classCategoryUuid, status);

}

classCategoryService.getMonthPicker = async (classCategoryUuid) => {

    const sessions = await classCategorySessionService.getOrderedActiveAndUpcomingSessions(classCategoryUuid);

    let currYear = -1;
    let currMonth = -1;

    let grouped = [];
    sessions.forEach(session => {

        const newYear = new Date(parseInt(session.startDate)).getFullYear();
        const newMonth = new Date(parseInt(session.startDate)).getMonth();

        if (currYear !== newYear) {
            currYear = newYear;
            currMonth = newMonth;
            grouped.push({
                year: newYear,
                months: [newMonth],
            })
        } else {
            if (currMonth !== newMonth) {
                grouped[grouped.length-1].months.push(month);
            }
        }

    });

    return grouped;

}

classCategoryService.getCategoryHistory = async (classCategoryUuid) => {

    const category = await ClassCategory.query()
        .findById(classCategoryUuid)
        .modify('categoryDetailWithoutInvoices');

    const participants = await classCategoryParticipantSessionService
        .categoryParticipantHistoryByCategoryUuid(classCategoryUuid);

    return {
        ...category,
        participants: participants,
    }

}

classCategoryService.getMyParticipantsHistory = async (categoryUuid, user) => {

    return classCategoryParticipantSessionService.mySessionsHistoryByCategoryUuidAndUserId(categoryUuid, user.sub);

}

module.exports = classCategoryService;