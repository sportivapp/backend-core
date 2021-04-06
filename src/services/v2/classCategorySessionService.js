const { NotFoundError, UnsupportedOperationError } = require('../../models/errors');
const ClassCategorySession = require('../../models/v2/ClassCategorySession');
const classCategoryParticipantSessionService = require('./classCategoryParticipantSessionService');
const ServiceHelper = require('../../helper/ServiceHelper');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const notificationService = require('../notificationService');
const NotificationEnum = require('../../models/enum/NotificationEnum');
const CodeToTextMonthEnum = require('../../models/enum/CodeToTextMonthEnum');

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
            if (newSessionStartDate >= existingStartDate && newSessionStartDate <= existingendDate ||
                newSessionEndDate >= existingStartDate && newSessionEndDate <= existingendDate) {
                    throw new UnsupportedOperationError(ErrorEnum.SCHEDULE_CONFLICT);
                }
        });
    });

}

classCategorySessionService.reschedule = async (classCategorySessionDTO, isRepeat, user) => {

    const updatedSession = await classCategorySessionService.findById(classCategorySessionDTO.uuid);
    const upcomingSessions = await classCategorySessionService
        .getSessions(classCategorySessionDTO.classCategoryUuid, [sessionStatusEnum.UPCOMING]);

    if (!isRepeat) {

        classCategorySessionService.checkConflictSession(upcomingSessions, [classCategorySessionDTO]);

        const updateSession = await updatedSession.$query()
            .updateByUserId(classCategorySessionDTO, user.sub)
            .returning('*');

        const cls = await updatedSession.$relatedQuery('class');
        const category = await updatedSession.$relatedQuery('classCategory');
        const participants = await updatedSession.$relatedQuery('participantSession')
            .then(participants => participants.map(participant => participant.userId));
        console.log(participants);
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
        upcomingSessions.forEach(upcomingSession => {
            
            const sessionDate = new Date(parseInt(updatedSession.startDate));
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

        classCategorySessionService.checkConflictSession(upcomingSessions, updatedSessions);

        const promises = updatedSessions.map(async updatedSession => {
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


module.exports = classCategorySessionService;