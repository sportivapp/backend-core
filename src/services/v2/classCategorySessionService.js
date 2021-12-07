const { NotFoundError, UnsupportedOperationError } = require('../../models/errors');
const ClassCategorySession = require('../../models/v2/ClassCategorySession');
const classCategoryParticipantSessionService = require('./classCategoryParticipantSessionService');
const ServiceHelper = require('../../helper/ServiceHelper');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const notificationService = require('../notificationService');
const NotificationEnum = require('../../models/enum/NotificationEnum');
const CodeToTextMonthEnum = require('../../models/enum/CodeToTextMonthEnum');
const cityService = require('../cityService');
const luxon = require('luxon');

const ErrorEnum = {
    INVALID_SESSION: 'INVALID_SESSION',
    SCHEDULE_CONFLICT: 'SCHEDULE_CONFLICT',
    INVALID_STATUS: 'INVALID_STATUS',
}

const classCategorySessionService = {};

classCategorySessionService.initCategorySession = async (sessionDTO, user, trx) => {

    return ClassCategorySession.query(trx)
        .insertToTable(sessionDTO, user.sub);

};

classCategorySessionService.findById = async (classCategorySessionUuid) => {

    return ClassCategorySession.query()
        .findById(classCategorySessionUuid)
        .then(session => {
            if (!session)
                throw new NotFoundError();
            return session;
        });

}

classCategorySessionService.checkConflictSession = (existingSessions, newSessions) => {

    existingSessions.forEach(existingSession => {
        const existingStartDate = parseInt(existingSession.startDate);
        const existingendDate = parseInt(existingSession.endDate);
        newSessions.forEach(newSession => {
            const newSessionStartDate = parseInt(newSession.startDate);
            const newSessionEndDate = parseInt(newSession.endDate);
            if (newSessionStartDate > existingStartDate && newSessionStartDate < existingendDate ||
                newSessionEndDate > existingStartDate && newSessionEndDate < existingendDate) {
                    throw new UnsupportedOperationError(ErrorEnum.SCHEDULE_CONFLICT);
                }
        });
    });

}

classCategorySessionService.reschedule = async (classCategorySessionDTO, isRepeat, user) => {

    const updatedSession = await ClassCategorySession.query()
        .findById(classCategorySessionDTO.uuid)
        .withGraphFetched('class')
        .then(session => {
            if (!session)
                throw new UnsupportedOperationError(ErrorEnum.SESSION_NOT_FOUND);
            return session;
        });

    // const timezone = await cityService.getTimezoneFromCityId(session.class.cityId);
    // const timezone = 'Asia/Jakarta';
    // const offset = luxon.DateTime.fromMillis(classCategorySessionDTO.startDate).setZone(timezone).offset;

    // classCategorySessionDTO.startDate = new Date(classCategorySessionDTO.startDate - (60000 * offset)).getTime();
    // classCategorySessionDTO.endDate = new Date(classCategorySessionDTO.endDate - (60000 * offset)).getTime();

    let sessions = await classCategorySessionService
        .getAllSessions(classCategorySessionDTO.classCategoryUuid);

    if (!isRepeat) {

        // remove the chosen session to be changed from checkConflict
        const filteredSessions = [];
        sessions.forEach(session => {
            if(!(session.uuid === chosenSession.uuid))
                filteredSessions.push(session);
        });

        classCategorySessionService.checkConflictSession(filteredSessions, [classCategorySessionDTO]);

        const updateSession = await updatedSession.$query()
            .updateByUserId(classCategorySessionDTO, user.sub)
            .returning('*');

        const completeSession = await updatedSession.$query().withGraphFetched('[class, classCategory, participantSession]');

        const cls = completeSession.class;
        const category = completeSession.classCategory;
        const participants = completeSession.participantSession.map(participant => participant.userId);

        const sessionDate = new Date(parseInt(updatedSession.startDate));
        const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;

        const notifAction = NotificationEnum.classSession.actions.reschedule;

        const notifObj = await notificationService.buildNotificationEntity(
            updatedSession.uuid,
            NotificationEnum.classSession.type,
            notifAction.title(cls.title, category.title),
            notifAction.message(sessionTitle),
            notifAction.code
        );

        notificationService.saveNotification(notifObj, user, participants);

        return updateSession;

    } else {

        const startDiff = parseInt(classCategorySessionDTO.startDate) - parseInt(updatedSession.startDate);
        const endDiff = parseInt(classCategorySessionDTO.endDate) - parseInt(updatedSession.endDate);

        const updatedSessions = [];
        const filteredSessions = [];
        sessions.forEach(session => {
            
            const updatedSessionDate = new Date(parseInt(updatedSession.startDate));
            const sessionDate = new Date(parseInt(session.startDate));

            // Get all matched session by day & hour & minute
            if (updatedSessionDate.getDay() === sessionDate.getDay() &&
            updatedSessionDate.getHours() === sessionDate.getHours() &&
            updatedSessionDate.getMinutes() === sessionDate.getMinutes()) {
                updatedSessions.push({
                    updatedSession: {
                        uuid: sessionDate.uuid,
                        startDate: parseInt(sessionDate.startDate) + startDiff,
                        endDate: parseInt(sessionDate.endDate) + endDiff,
                    },
                    previous: {
                        startDate: parseInt(sessionDate.startDate),
                        endDate: parseInt(sessionDate.endDate),
                    }
                });
            } else {
                filteredSessions.push(session)
            }
        });

        classCategorySessionService.checkConflictSession(filteredSessions, updatedSessions);

        const promises = updatedSessions.map(async ({ updatedSession, previous }) => {
            const updateSession = await ClassCategorySession.query()
                .where('uuid', updatedSession.uuid)
                .updateByUserId(updatedSession, user.sub)
                .first()
                .returning('*');

            const completeSession = await updatedSession.$query().withGraphFetched('[class, classCategory, participantSession]');

            const cls = completeSession.class;
            const category = completeSession.classCategory;
            const participants = completeSession.participantSession.map(participant => participant.userId);

            const sessionDate = new Date(previous.startDate);
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

classCategorySessionService.extendSchedule = async (sessionDTO, user, trx) => {

    return ClassCategorySession.query(trx)
        .insertToTable(sessionDTO, user.sub);

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

classCategorySessionService.getAllSessions = async (classCategoryUuid) => {

    return ClassCategorySession.query()
        .modify('list')
        .where('class_category_uuid', classCategoryUuid);

}

classCategorySessionService.getAllUpcomingSessions = async () => {

    return ClassCategorySession.query()
        .where('status', sessionStatusEnum.UPCOMING)
        .where('start_date', '>', Date.now())
        .orderBy('start_date', 'ASC');

}

classCategorySessionService.getAllFinishedSessions = async () => {

    return ClassCategorySession.query()
        .where('status', sessionStatusEnum.DONE)
        .orderBy('start_date', 'ASC');

}

classCategorySessionService.checkLastSession = async () => {
    const lastSessions = await ClassCategorySession.query()
        .distinctOn('class_category_uuid')
        .modify('listWithoutOrder')
        .where('status', sessionStatusEnum.UPCOMING)
        .orderBy(['class_category_uuid', { column: 'start_date', order: 'DESC' }]);
    const promises = lastSessions.map(async session => {
        const completeSession = await session.$query().withGraphFetched('[class, classCategory.coaches]');
        const cls = completeSession.class;
        const category = completeSession.classCategory;
        const coaches = completeSession.classCategory.coaches;
        const now = new Date();
        const sessionDate = new Date(parseInt(session.startDate));
        if (sessionDate.getDate() !== now.getDate() ||
            sessionDate.getMonth() !== now.getMonth() ||
            sessionDate.getFullYear() !== now.getFullYear())
            return null;
        const notifAction = NotificationEnum.classCategory.actions.extend;
        const notifObj = await notificationService.buildNotificationEntity(
            category.uuid,
            NotificationEnum.classCategory.type,
            notifAction.title(cls.title, category.title),
            notifAction.message(),
            notifAction.code
        );
        return notificationService.saveNotification(notifObj, { sub: coaches[0].userId }, coaches.map(coach => coach.userId));
    }).filter(promise => !!promise);

    return Promise.all(promises);
}


module.exports = classCategorySessionService;