const { NotFoundError, UnsupportedOperationError } = require('../../models/errors');
const ClassCategory = require('../../models/v2/ClassCategory');
const classCategoryCoachService = require('./classCategoryCoachService');
const classCategorySessionService = require ('./classCategorySessionService');
const dayToCodeEnum = require('../../models/enum/DayToCodeEnum');
const codeToDayEnum = require('../../models/enum/CodeToDayEnum');
const classCategoryParticipantService = require('./classCategoryParticipantService');
const classCategoryScheduleService = require('./classCategoryScheduleService');
const classCoachService = require('./classCoachService');
const classCategoryPriceLogService = require('./classCategoryPriceLogService');

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

        return classCategories = ClassCategory.query(trx)
            .insertToTable(newCategory, user.sub)
            .then(async classCategory => {
                const categoryCoachDTO = category.categoryCoachUserIds.map(categoryCoachUserId => {
                    return {
                        classUuid: classCategory.classUuid,
                        classCategoryUuid: classCategory.uuid,
                        userId: categoryCoachUserId,
                    }
                });

                const priceLogDTO = {
                    classUuid: classCategory.classUuid,
                    classCategoryUuid: classCategory.uuid,
                    price: classCategory.price,
                }

                const sessionAndSchedule = classCategoryService
                    .generateSessionAndScheduleFromCategorySchedules(classCategory.classUuid, classCategory.uuid, 
                        category.startMonth, category.endMonth, category.schedules);

                if (sessionAndSchedule.session.length === 0)
                    throw new UnsupportedOperationError(ErrorEnum.NO_SESSIONS);
                const classCategoryCoach = await classCategoryCoachService.initCategoryCoach(categoryCoachDTO, user, trx);
                const classCategorySession = await classCategorySessionService.initCategorySession(sessionAndSchedule.session, user, trx);
                const classCategorySchedule = await classCategoryScheduleService.initSchedules(sessionAndSchedule.schedule, user, trx);
                await classCategoryPriceLogService.addPriceLog(priceLogDTO, user, trx);

                return {
                    ...classCategory,
                    classCategoryCoach: classCategoryCoach,
                    classCategorySession: classCategorySession,
                    classCategorySchedule: classCategorySchedule,
                }
            });

    });
    return Promise.all(classCategoryPromises);

}

classCategoryService.getClassCategory = async (classCategoryUuid) => {

    const category = await ClassCategory.query()
        .modify('adminDetail')
        .findById(classCategoryUuid)
        .then(classCategory => {
            if (!classCategory)
                throw new NotFoundError();
            classCategory.price = parseInt(classCategory.price);
            return classCategory;
        });

    return {
        ...category,
        totalParticipants: await classCategoryParticipantService.getParticipantsCountByClassCategoryUuid(classCategoryUuid),
    }

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

classCategoryService.getSchedules = async (classCategoryUuid) => {

    return classCategoryScheduleService.getSchedules(classCategoryUuid);

}

classCategoryService.findById = async (classCategoryUuid) => {

    return ClassCategory.query()
        .findById(classCategoryUuid)
        .then(category => {
            if (!category)
                throw new UnsupportedOperationError(ErrorEnum.CATEGORY_NOT_FOUND);
            return category;
        });

}

classCategoryService.extendSchedule = async (extendCategoryDTO, user) => {

    const category = await classCategoryService.findById(extendCategoryDTO.uuid);

    const sessionAndSchedule = classCategoryService
        .generateSessionAndScheduleFromCategorySchedules(category.classUuid, category.uuid, 
            extendCategoryDTO.startMonth, extendCategoryDTO.endMonth, category.schedules);

    if (sessionDTO.length === 0)
        throw new UnsupportedOperationError(ErrorEnum.NO_SESSIONS);

    const upcomingSessions = await classCategorySessionService.getSessions(category.uuid, [sessionStatusEnum.UPCOMING]);
    classCategorySessionService.checkConflictSession(upcomingSessions, sessionAndSchedule.session);
    
    return ClassCategory.transaction(async trx => {

        if (category.onHold === true) {
            await ClassCategory.query(trx)
                .updateByUserId({
                    onHold: false,
                }, user.sub);
        }

        return classCategorySessionService.extendSchedule(sessionDTO, user, trx);

    });

}

classCategoryService.updateCategory = async (categoryDTO, user) => {

    const category = await classCategoryService.findById(categoryDTO.uuid);

    const newCategory = {
        title: categoryDTO.title,
        description: categoryDTO.description,
        price: categoryDTO.price,
        requirements: categoryDTO.requirements,
    }

    return ClassCategory.transaction(async trx => {

        if (category.price !== newCategory.price) {
            await classCategoryPriceLogService.addPriceLog({
                classUuid: category.classUuid,
                classCategoryUuid: category.uuid,
                price: newCategory.price,
            }, user, trx);
        }

        await classCategoryCoachService.saveCoach(categoryDTO, user, trx);

        return category.$query(trx)
            .updateByUserId(newCategory, user.sub)
            .returning('*');

    });

}

classCategoryService.deleteCategory = async (classCategoryUuid) => {

    const category = await classCategoryService.findById(classCategoryUuid);

    const totalParticipants = await classCategoryParticipantService
        .getParticipantsCountByClassCategoryUuid(classCategoryUuid);

    if (totalParticipants !== 0)
        throw new UnsupportedOperationError(ErrorEnum.PARTICIPANTS_EXISTED);
    else {
        return category.$query()
            .softDelete()
            .then(rowsAffected => rowsAffected === 1);
    }

}

classCategoryService.addCategory = async (startMonth, endMonth, category, user) => {

    const newCategory = {};
    newCategory.classUuid = category.classUuid;
    newCategory.title = category.title;
    newCategory.description = category.description;
    newCategory.price = category.price;
    newCategory.requirements = category.requirements;

    return ClassCategory.transaction(async trx => {

        return ClassCategory.query(trx)
        .insertToTable(newCategory, user.sub)
        .then(async classCategory => {

            const categoryCoachDTO = category.categoryCoachUserIds.map(categoryCoachUserId => {
                return {
                    classUuid: classCategory.classUuid,
                    classCategoryUuid: classCategory.uuid,
                    userId: categoryCoachUserId,
                }
            });
            
            const sessionAndSchedule = classCategoryService
                .generateSessionAndScheduleFromCategorySchedules(classCategory.classUuid, classCategory.uuid, 
                    startMonth, endMonth, category.schedules);

            if (sessionAndSchedule.session.length === 0)
                throw new UnsupportedOperationError(ErrorEnum.NO_SESSIONS);
            const classCategoryCoach = await classCategoryCoachService.initCategoryCoach(categoryCoachDTO, user, trx);
            const classCategorySession = await classCategorySessionService.initCategorySession(sessionAndSchedule.session, user, trx);
            const classCategorySchedule = await classCategoryScheduleService.initSchedules(sessionAndSchedule.schedule, user, trx);

            return {
                ...classCategory,
                classCategoryCoach: classCategoryCoach,
                classCategorySession: classCategorySession,
                classCategorySchedule: classCategorySchedule,
            }
        });

    });

}

classCategoryService.generateSessionAndScheduleFromCategorySchedules = (classUuid, classCategoryUuid, 
    startMonth, endMonth, schedules) => {

    let sessionDTO = [];
    let scheduleDTO = [];
    schedules.map(schedule => {
        const categoryStartDate = new Date(startMonth);
        const day = categoryStartDate.getDay();
        const requestedDay = dayToCodeEnum[schedule.day];
        if (day !== requestedDay) {
            const diff = day < requestedDay ? requestedDay - day : 7 - (day - requestedDay);
            categoryStartDate.setDate(categoryStartDate.getDate() + diff);
        }
        scheduleDTO.push({
            classUuid: classUuid,
            classCategoryUuid: classCategoryUuid,
            day: codeToDayEnum[requestedDay],
            dayCode: requestedDay,
            startHour: schedule.startHour,
            endHour: schedule.endHour,
            startMinute: schedule.startMinute,
            endMinute: schedule.endMinute,
        });
        let sessionStartDate = new Date(categoryStartDate.getFullYear(), categoryStartDate.getMonth(), categoryStartDate.getDate(), schedule.startHour, schedule.startMinute);
        let sessionEndDate = new Date(categoryStartDate.getFullYear(), categoryStartDate.getMonth(), categoryStartDate.getDate(), schedule.endHour, schedule.endMinute);
        const now = Date.now();
        // Loop to increase 7days per schedule from startDate to endDate
        while (sessionStartDate.getTime() < endMonth) {
            if (sessionStartDate < now) {
                // Do nothing
            } else {
                let sessionMonthUtc = new Date(Date.UTC(sessionStartDate.getFullYear(), sessionStartDate.getMonth(), 1)).getTime();
                sessionDTO.push({
                    classUuid: classUuid,
                    classCategoryUuid: classCategoryUuid,
                    initStartDate: sessionStartDate.getTime(),
                    initEndDate: sessionEndDate.getTime(),
                    startDate: sessionStartDate.getTime(),
                    endDate: sessionEndDate.getTime(),
                    monthUtc: sessionMonthUtc,
                });
            }
            sessionStartDate.setDate(sessionStartDate.getDate() + 7);
            sessionEndDate.setDate(sessionEndDate.getDate() + 7);
        }
    });

    return {
        session: sessionDTO,
        schedule: scheduleDTO,
    }

    
}

module.exports = classCategoryService;