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

    const isCoach = await classCategoryCoachService.getCoachCategory(user.sub, classCategoryUuid);
    classCategory.categorySessions = classCategorySessionService.groupSessions(classCategory.categorySessions);
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

classCategoryService.getMyCategory = async (classCategoryUuid, status, user) => {

    if (!sessionStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);

    const sessionUuids = await classCategorySessionService.getMySessionUuidsByCategoryUuid(classCategoryUuid, status, user);
    if (sessionUuids.length === 0)
        return [];

    return ClassCategory.query()
        .findById(classCategoryUuid)
        .modify('myCategory', sessionUuids)
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
            .getSessionByCategoryUuidAndStatus(classCategoryUuid, sessionStatusEnum.UPCOMING);

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

    return {
        ...category,
        categorySessions: bookableSessions,
    }

}

classCategoryService.mySessionHistory = async (classCategoryUuid, user) => {

    const category = await ClassCategory.query()
        .findById(classCategoryUuid)
        .modify('uuidAndTitle')
        .withGraphFetched('class(basic)')

    const participantSessions = await classCategoryParticipantSessionService
        .mySessionHistoryByCategoryUuidAndUserId(category.uuid, user.sub);

    return {
        ...category,
        classCategoryParticipantSessions: participantSessions,
    }

}

classCategoryService.getCategoryComplaints = async (classCategoryUuid, user) => {

    return classComplaintService.getCategoryComplaints(classCategoryUuid);

}

module.exports = classCategoryService;