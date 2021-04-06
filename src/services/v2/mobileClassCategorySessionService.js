const ClassCategorySession = require('../../models/v2/ClassCategorySession');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const { UnsupportedOperationError } = require('../../models/errors');
const classRatingsService = require('./mobileClassRatingsService');
const classReasonsService = require('./mobileClassReasonsService');
const classComplaintsService = require('./mobileClassComplaintsService');
const classComplaintEnum = require('../../models/enum/ClassComplaintEnum');
const codeToDayEnum = require('../../models/enum/CodeToDayEnum');
const codeToMonthEnum = require('../../models/enum/CodeToMonthEnum');
const timeService = require('../../helper/timeService');
const classCategoryCoachService = require('./mobileClassCategoryCoachService');
const notificationService = require('../notificationService');
const NotificationEnum = require('../../models/enum/NotificationEnum');
const CodeToTextMonthEnum = require('../../models/enum/CodeToTextMonthEnum');

const ErrorEnum = {
    INVALID_SESSION: 'INVALID_SESSION',
    INVALID_ONGOING_SESSION: 'INVALID_ONGOING_SESSION',
    SCHEDULE_CONFLICT: 'SCHEDULE_CONFLICT',
    INVALID_COMPLAINT_CODE: 'INVALID_COMPLAINT_CODE',
}

const classCategorySessionService = {};

classCategorySessionService.startSession = async (classCategorySessionUuid, user) => {

    const session = await ClassCategorySession.query()
        .findById(classCategorySessionUuid);

    const updatedSession = await session.$query()
        .updateByUserId({
            status: sessionStatusEnum.ONGOING,
            startTime: Date.now(),
            startBy: user.sub,
        }, user.sub)
        .returning("*");

    const sessionParticipantIds = await session.$relatedQuery('participantSession')
        .then(participants => participants.map(participant => participant.userId));

    const category = await session.$relatedQuery('classCategory');
    const cls = await session.$relatedQuery('class');

    const notificationAction = NotificationEnum.classSession.actions.start;

    const notification = await notificationService.buildNotificationEntity(
        session.uuid,
        NotificationEnum.classSession.type,
        notificationAction.title(cls.title, category.title),
        notificationAction.message(),
        notificationAction.code);

    notificationService.saveNotification(notification, user, sessionParticipantIds);

    return updatedSession;

}

classCategorySessionService.findById = async(classCategorySessionUuid) => {

    return ClassCategorySession.query()
        .findById(classCategorySessionUuid)
        .then(session => {
            if (!session)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_SESSION);
            return session;
        });

}

classCategorySessionService.inputAbsence = async(classCategoryUuid, classCategorySessionUuid, participants, user) => {

    await classCategoryCoachService.checkCoachCategory(user.sub, classCategoryUuid);
    const session = await classCategorySessionService.findById(classCategorySessionUuid);

    if (session.status !== sessionStatusEnum.ONGOING)
        throw new UnsupportedOperationError(ErrorEnum.INVALID_ONGOING_SESSION);

    const absences = await classCategoryParticipantSessionService.inputAbsence(participants, user);

    await session.$query()
        .updateByUserId({
            absenceTime: Date.now(),
            absenceBy: user.sub,
        }, user.sub);

    return absences;

}

classCategorySessionService.getSessionByUuid = async (classCategorySessionUuid) => {

    return ClassCategorySession.query()
        .findById(classCategorySessionUuid)
        .then(session => {
            if(!session)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_SESSION);
            return session;
        });

}

classCategorySessionService.getSessionByCategoryUuidAndStatus = async (classCategoryUuid, status) => {

    return ClassCategorySession.query()
        .where('class_category_uuid', classCategoryUuid)
        .where('status', status);

}

classCategorySessionService.endSession = async (classCategorySessionUuid, user, trx) => {

    const session = await ClassCategorySession.query()
        .findById(classCategorySessionUuid);

    await classCategoryParticipantSessionService.updateParticipantConfirmedExpiration(classCategorySessionUuid, trx);

    const updatedSession = await session.$query(trx)
    .updateByUserId({
        status: sessionStatusEnum.DONE,
        endTime: Date.now(),
        endBy: user.sub,
    }, user.sub);

    const sessionParticipantIds = await session.$relatedQuery('participantSession')
        .then(participants => participants.map(participant => participant.userId));

    if (sessionParticipantIds.length < 1) return updatedSession;

    const category = await session.$relatedQuery('classCategory');
    const cls = await session.$relatedQuery('class');
    const upcomingSessions = await classCategorySessionService.getSessionByCategoryUuidAndStatus(category.uuid, sessionStatusEnum.UPCOMING);

    const notifPromiseList = [];
    if (upcomingSessions.length === 0) {
        const classDoneAction = NotificationEnum.classCategory.actions.finished;
        const classDoneNotifObj = await notificationService.buildNotificationEntity(
            category.uuid,
            NotificationEnum.classCategory.type,
            classDoneAction.title(cls.title, category.title),
            classDoneAction.message(),
            classDoneAction.code
        );
        notifPromiseList.push(notificationService.saveNotification(classDoneNotifObj, user, sessionParticipantIds));
    }

    const sessionDate = new Date(parseInt(session.startDate));
    const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;

    const endSessionAction = NotificationEnum.classSession.actions.end;
    const requireConfirmationAction = NotificationEnum.classSession.actions.requireConfirmation;

    const endSessionNotifObj = await notificationService.buildNotificationEntity(
        session.uuid,
        NotificationEnum.classSession.type,
        endSessionAction.title(cls.title, category.title),
        endSessionAction.message(sessionTitle),
        endSessionAction.code);

    const requireConfirmationNotifObj = await notificationService.buildNotificationEntity(
        session.uuid,
        NotificationEnum.classSession.type,
        requireConfirmationAction.title(cls.title, category.title),
        requireConfirmationAction.message(sessionTitle),
        requireConfirmationAction.code);

    notifPromiseList.push(notificationService.saveNotification(endSessionNotifObj, user, sessionParticipantIds));
    notifPromiseList.push(notificationService.saveNotification(requireConfirmationNotifObj, user, sessionParticipantIds));

    Promise.all(notifPromiseList);

    return updatedSession;

}

classCategorySessionService.getSessionByUuid = async (classCategorySessionUuid) => {

    return ClassCategorySession.query()
        .findById(classCategorySessionUuid)
        .then(session => {
            if(!session)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_SESSION);
            return session;
        });

}

classCategorySessionService.getSessionParticipants = async (classCategoryUuid, classCategorySessionUuid) => {

    const session = await classCategorySessionService.getSessionByUuid(classCategorySessionUuid);
    return classCategoryParticipantSessionService.getSessionParticipants(classCategorySessionUuid);

}

classCategorySessionService.reschedule = async (classCategorySessionDTO, isRepeat, user) => {

    const session = await classCategorySessionService.findById(classCategorySessionDTO.uuid);
    const upcomingSessions = await classCategorySessionService
        .getSessions(classCategorySessionDTO.classCategoryUuid, [sessionStatusEnum.UPCOMING]);

    if (!isRepeat) {

        classCategorySessionService.checkConflictSession(upcomingSessions, [classCategorySessionDTO]);

        const updateSession = await session.$query()
            .updateByUserId(classCategorySessionDTO, user.sub)
            .returning('*');

        const cls = await session.$relatedQuery('class');
        const category = await session.$relatedQuery('classCategory');
        const participants = await session.$relatedQuery('participantSession')
            .then(participants => participants.map(participant => participant.userId));
        const sessionDate = new Date(parseInt(session.startDate));
        const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;

        const notifAction = NotificationEnum.classSession.actions.reschedule;

        const notifObj = await notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession.type,
            notifAction.title(cls.title, category.title),
            notifAction.message(sessionTitle),
            notifAction.code
        );

        notificationService.saveNotification(notifObj, user, participants);

        return updateSession;

    } else {

        const startDiff = parseInt(classCategorySessionDTO.startDate) - parseInt(session.startDate);
        const endDiff = parseInt(classCategorySessionDTO.endDate) - parseInt(session.endDate);

        const updatedSessions = [];
        upcomingSessions.forEach(upcomingSession => {
            
            const sessionDate = new Date(parseInt(session.startDate));
            const upcomingSessionDate = new Date(parseInt(upcomingSession.startDate));

            // Get all matched session by day & hour & minute
            if (sessionDate.getDay() === upcomingSessionDate.getDay() &&
            sessionDate.getHours() === upcomingSessionDate.getHours() &&
            sessionDate.getMinutes() === upcomingSessionDate.getMinutes()) {
                updatedSessions.push({
                    uuid: upcomingSession.uuid,
                    startDate: parseInt(upcomingSession.startDate) + startDiff,
                    endDate: parseInt(upcomingSession.endDate) + endDiff,
                });
            }
        });

        classCategorySessionService.checkConflictSession(upcomingSessions, session);

        const promises = session.map(async updatedSession => {
            const updateSession = await ClassCategorySession.query()
                .where('uuid', updatedSession.uuid)
                .updateByUserId(updatedSession, user.sub)
                .first()
                .returning('*');

            const cls = await updateSession.$relatedQuery('class');
            const category = await updateSession.$relatedQuery('classCategory');
            const participants = await updateSession.$relatedQuery('participantSession')
                .then(participants => participants.map(participant => participant.userId));
            const sessionDate = new Date(parseInt(updateSession.initStartDate));
            const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;

            const notifAction = NotificationEnum.classSession.actions.reschedule;

            const notifObj = await notificationService.buildNotificationEntity(
                updateSession.uuid,
                NotificationEnum.classSession.type,
                notifAction.title(cls.title, category.title),
                notifAction.message(sessionTitle),
                notifAction.code
            );

            notificationService.saveNotification(notifObj, user, participants);

            return updateSession;
        });

        return Promise.all(promises);

    }

}

classCategorySessionService.getSessions = async (classCategoryUuid, statuses, page, size) => {

    statuses.forEach(status => {
        if (!sessionStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);
    });

    let query = ClassCategorySession.query()
        .modify('list')
        .where('class_category_uuid', classCategoryUuid)
        .whereIn('status', statuses)

    if (typeof(page) === 'number' && typeof(size) === 'number') {
        query = query.page(page, size)
        .then(sessionPage => {
            return ServiceHelper.toPageObj(page, size, sessionPage);
        });
    }

    return query;

}

classCategorySessionService.checkConflictSession = (existingSessions, newSessions) => {

    existingSessions.forEach(existingSession => {
        const existingStartDate = parseInt(existingSession.startDate);
        const existingEndDate = parseInt(existingSession.endDate);
        newSessions.forEach(newSession => {
            const newSessionStartDate = parseInt(newSession.startDate);
            const newSessionEndDate = parseInt(newSession.endDate);
            if (newSessionStartDate >= existingStartDate && newSessionStartDate <= existingEndDate ||
                newSessionEndDate >= existingStartDate && newSessionEndDate <= existingEndDate) {
                    throw new UnsupportedOperationError(ErrorEnum.SCHEDULE_CONFLICT);
                }
        });
    });

}

classCategorySessionService.confirmParticipation = async (classCategorySessionUuid, classCategoryParticipantSessionUuid, isConfirm, user) => {

    await classCategorySessionService.findById(classCategorySessionUuid)
    return classCategoryParticipantSessionService.confirmParticipation(classCategoryParticipantSessionUuid, isConfirm, user);

}

classCategorySessionService.rate = async (classRatingsDTO, improvementCodes, user) => {

    const participantSession = await classCategoryParticipantSessionService
        .getSingleParticipantWithSession(classRatingsDTO.classCategorySessionUuid, user.sub);
    
    classRatingsDTO.classUuid = participantSession.classUuid;
    classRatingsDTO.classCategoryUuid = participantSession.classCategoryUuid;
    classRatingsDTO.classCategoryParticipantSessionUuid = participantSession.uuid;

    await classRatingsService.checkExistUserRating(classRatingsDTO.classCategorySessionUuid, user);
    return classRatingsService.rate(classRatingsDTO, improvementCodes, user);

}

classCategorySessionService.reason = async (classReasonsDTO, user) => {

    const participantSession = await classCategoryParticipantSessionService
        .getSingleParticipantWithSession(classReasonsDTO.classCategorySessionUuid, user.sub);

    classReasonsDTO.classUuid = participantSession.classUuid;
    classReasonsDTO.classCategoryUuid = participantSession.classCategoryUuid;
    classReasonsDTO.classCategoryParticipantSessionUuid = participantSession.uuid;

    await classReasonsService.checkExistUserReason(classReasonsDTO.classCategorySessionUuid, user);
    return classReasonsService.reason(classReasonsDTO, user);

}

classCategorySessionService.complaintSession = async (classComplaintsDTO, user) => {

    if (!classComplaintEnum[classComplaintsDTO.code])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_COMPLAINT_CODE);

    const participantSession = await classCategoryParticipantSessionService
        .getSingleParticipantWithSession(classComplaintsDTO.classCategorySessionUuid, user.sub);

    classComplaintsDTO.classUuid = participantSession.classUuid;
    classComplaintsDTO.classCategoryUuid = participantSession.classCategoryUuid;
    classComplaintsDTO.classCategoryParticipantSessionUuid = participantSession.uuid;

    await classComplaintsService.checkExistUserComplaint(classComplaintsDTO.classCategorySessionUuid, user);
    return classComplaintsService.complaintSession(classComplaintsDTO, user);

}

classCategorySessionService.getActiveClosestSessionsByStatusAndGroupByCategory = async (sessionUuids, status) => {

    return ClassCategorySession.query()
        .where('status', status)
        .whereIn('uuid', sessionUuids)
        .where('start_date', '>=', Date.now())
        .orderBy('start_date', 'ASC')
        .then(sessions => {
            let seen = {};
            return sessions.filter(session => {
                if (!seen[session.classCategoryUuid]) {
                    seen[session.classCategoryUuid] = true;
                    return true;
                }
                return false;
            });
        });

}

classCategorySessionService.getActiveSessionsByStatus = async (sessionUuids, status) => {

    return ClassCategorySession.query()
        .where('status', status)
        .whereIn('uuid', sessionUuids)
        .where('start_date', '>=', Date.now())
        .orderBy('start_date', 'ASC');

}

classCategorySessionService.getMySessionUuidsByCategoryUuid = async (categoryUuid, status, user) => {

    return ClassCategorySession.query()
        .modify('mySessions', user.sub)
        .where('status', status)
        .where('class_category_uuid', categoryUuid)
        .where('start_date', '>=', Date.now())
        .orderBy('start_date', 'ASC')
        .then(sessions => sessions.map(session => {
            return session.uuid;
        }));

}

classCategorySessionService.getActiveClosestSessionsByStatusAndGroupByCategory = async (sessionUuids, status) => {

    return ClassCategorySession.query()
        .where('status', status)
        .whereIn('uuid', sessionUuids)
        .where('start_date', '>=', Date.now())
        .orderBy('start_date', 'ASC')
        .then(sessions => {
            let seen = {};
            return sessions.filter(session => {
                if (!seen[session.classCategoryUuid]) {
                    seen[session.classCategoryUuid] = true;
                    return true;
                }
                return false;
            });
        });

}

classCategorySessionService.getActiveSessionsByStatus = async (sessionUuids, status) => {

    return ClassCategorySession.query()
        .where('status', status)
        .whereIn('uuid', sessionUuids)
        .where('start_date', '>=', Date.now())
        .orderBy('start_date', 'ASC');

}

classCategorySessionService.getBookableSessions = async (classCategoryUuid, year, userId) => {

    const { start, end } = timeService.getYearRange(year);

    return ClassCategorySession.query()
        .modify('bookableSessions', classCategoryUuid, start, end, userId);

}

classCategorySessionService.groupOrderedRecurringSessions = (sessions) => {

    let foundMonth = {};
    let monthIndex = -1;
    const grouped = [];

    let dayCodeIndexMapped = {};
    let dayIndex = 0;

    sessions.forEach(session => {

        const startDate = new Date(parseInt(session.startDate));
        const monthCode = startDate.getMonth();
        const month = codeToMonthEnum[monthCode];
        const dayCode = startDate.getDay();
        const day = codeToDayEnum[dayCode];

        if (!foundMonth[month]) {
            foundMonth[month] = true;
            dayCodeIndexMapped = {};
            dayIndex = 0;

            monthIndex++;
            dayCodeIndexMapped[dayCode] = dayIndex;
            grouped[monthIndex] = {
                name: month,
                // To state whether user can book this month's sessions
                isParticipated: session.participantSession.length !== 0,
                days: [
                    {
                        day: day,
                        sessions: [session],
                    }
                ]
            };

        } else {

            if (dayCodeIndexMapped[dayCode] === undefined) {
                dayIndex++;
                dayCodeIndexMapped[dayCode] = dayIndex;
                grouped[monthIndex].days[dayCodeIndexMapped[dayCode]] = {
                    day: day,
                    sessions: [session],
                };
            } else {
                grouped[monthIndex].days[dayCodeIndexMapped[dayCode]].sessions.push(session);
            }

        }

    });

    return grouped;

}

classCategorySessionService.groupOrderedNonRecurringSessions = (sessions) => {

    let foundMonth = {};
    let monthIndex = -1;
    const grouped = [];

    let dayCodeIndexMapped = {};
    let dayIndex = 0;

    sessions.forEach(session => {

        // To state whether user can book this session
        session.isParticipated = session.participantSession.length !== 0;
        session.price = parseInt(session.price);
        const startDate = new Date(parseInt(session.startDate));
        const monthCode = startDate.getMonth();
        const month = codeToMonthEnum[monthCode];
        const dayCode = startDate.getDay();
        const day = codeToDayEnum[dayCode];

        if (!foundMonth[month]) {
            foundMonth[month] = true;
            dayCodeIndexMapped = {};
            dayIndex = 0;

            monthIndex++;
            dayCodeIndexMapped[dayCode] = dayIndex;
            grouped[monthIndex] = {
                name: month,
                days: [
                    {
                        day: day,
                        sessions: [session],
                    }
                ]
            };

        } else {

            if (dayCodeIndexMapped[dayCode] === undefined) {
                dayIndex++;
                dayCodeIndexMapped[dayCode] = dayIndex;
                grouped[monthIndex].days[dayCodeIndexMapped[dayCode]] = {
                    day: day,
                    sessions: [session],
                };
            } else {
                grouped[monthIndex].days[dayCodeIndexMapped[dayCode]].sessions.push(session);
            }

        }

    });

    return grouped;

}

classCategorySessionService.groupSessions = (sessions) => {

    let foundMonth = {};
    let monthIndex = -1;
    const grouped = [];

    let dayCodeIndexMapped = {};
    let dayIndex = 0;

    sessions.forEach(session => {

        const startDate = new Date(parseInt(session.startDate));
        const monthCode = startDate.getMonth();
        const month = codeToMonthEnum[monthCode];
        const dayCode = startDate.getDay();
        const day = codeToDayEnum[dayCode];

        if (!foundMonth[month]) {
            foundMonth[month] = true;
            dayCodeIndexMapped = {};
            dayIndex = 0;

            monthIndex++;
            dayCodeIndexMapped[dayCode] = dayIndex;
            grouped[monthIndex] = {
                name: month,
                days: [
                    {
                        name: day,
                        sessions: [session],
                    }
                ]
            };

        } else {

            if (dayCodeIndexMapped[dayCode] === undefined) {
                dayIndex++;
                dayCodeIndexMapped[dayCode] = dayIndex;
                grouped[monthIndex].days[dayCodeIndexMapped[dayCode]] = {
                    name: day,
                    sessions: [session],
                };
            } else {
                grouped[monthIndex].days[dayCodeIndexMapped[dayCode]].sessions.push(session);
            }

        }

    });

    return grouped;

}

classCategorySessionService.findSessions = (sessionUuids) => {

    return ClassCategorySession.query()
        .whereIn('uuid', sessionUuids);
    
}

classCategorySessionService.getActiveSessionUuidsByCategoryUuid = async (categoryUuid) => {

    return ClassCategorySession.query()
        .where('class_category_uuid', categoryUuid)
        .whereIn('status', [sessionStatusEnum.UPCOMING, sessionStatusEnum.ONGOING])
        .then(sessions => {
            return sessions.map(session => {
                return session.uuid;
            });
        });

}

classCategorySessionService.getTotalParticipantsByCategoryUuid = async (categoryUuid) => {

    const sessionUuids = await classCategorySessionService.getActiveSessionUuidsByCategoryUuid(categoryUuid);

    return classCategoryParticipantSessionService.getTotalParticipantsBySessionUuids(sessionUuids);

}

classCategorySessionService.getOrderedActiveAndUpcomingSessions = async (categoryUuid) => {

    return ClassCategorySession.query()
        .where('class_category_uuid', categoryUuid)
        .where('status', sessionStatusEnum.UPCOMING)
        .where('start_date', '>', Date.now())
        .orderBy('start_date');

}

module.exports = classCategorySessionService;