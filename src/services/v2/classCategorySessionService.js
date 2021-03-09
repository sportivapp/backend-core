const { NotFoundError, UnsupportedOperationError } = require('../../models/errors');
const ClassCategorySession = require('../../models/v2/ClassCategorySession');
const classCategoryParticipantService = require('./classCategoryParticipantService');
const ServiceHelper = require('../../helper/ServiceHelper');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');

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
        existingSession.startDate = parseInt(existingSession.startDate);
        existingSession.endDate = parseInt(existingSession.endDate);
        newSessions.forEach(newSession => {
            newSession.startDate = parseInt(newSession.startDate);
            newSession.endDate = parseInt(newSession.endDate);
            if (newSession.startDate >= existingSession.startDate && newSession.startDate <= existingSession.endDate ||
                newSession.endDate >= existingSession.startDate && newSession.endDate <= existingSession.endDate)
                throw new UnsupportedOperationError(ErrorEnum.SCHEDULE_CONFLICT);
        });
    });

}

classCategorySessionService.reschedule = async (classCategorySessionDTO, isRepeat, user) => {

    const session = await classCategorySessionService.findById(classCategorySessionDTO.uuid);
    const upcomingSessions = await classCategorySessionService
        .getSessions(classCategorySessionDTO.classCategoryUuid, [sessionStatusEnum.UPCOMING]);

    if (!isRepeat) {

        classCategorySessionService.checkConflictSession(upcomingSessions, [classCategorySessionDTO]);

        return session.$query()
            .updateByUserId(classCategorySessionDTO, user.sub)
            .returning('*');

    } else {

        const startDiff = parseInt(classCategorySessionDTO.startDate) - parseInt(session.startDate);
        const endDiff = parseInt(classCategorySessionDTO.endDate) - parseInt(session.endDate);

        const updatedSessions = upcomingSessions.filter(upcomingSession => {
            
            const sessionDate = new Date(parseInt(session.startDate));
            const upcomingSessionDate = new Date(parseInt(upcomingSession.startDate));

            // Get all matched session by day & hour & minute
            if (sessionDate.getDay() === upcomingSessionDate.getDay() &&
            sessionDate.getHours() === upcomingSessionDate.getHours() &&
            sessionDate.getMinutes() === upcomingSessionDate.getMinutes()) { 
                upcomingSession.startDate = parseInt(upcomingSession.startDate);
                upcomingSession.endDate = parseInt(upcomingSession.endDate);
                return upcomingSession;
            }
        }).map(matchedUpcomingSession => {
            return {
                ...matchedUpcomingSession,
                startDate: matchedUpcomingSession.startDate + startDiff,
                endDate: matchedUpcomingSession.endDate + endDiff,
            }
        });

        classCategorySessionService.checkConflictSession(upcomingSessions, updatedSessions);

        const promises = updatedSessions.map(updatedSession => {
            return ClassCategorySession.query()
                .where('uuid', updatedSession.uuid)
                .updateByUserId(updatedSession, user.sub)
                .first()
                .returning('*');
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

classCategorySessionService.getSessionParticipants = async (classCategoryUuid, classCategorySessionUuid, isCheckIn) => {

    const session = await classCategorySessionService.getSessionByUuid(classCategorySessionUuid);
    return classCategoryParticipantService.getSessionParticipants(session, isCheckIn);

}

classCategorySessionService.getSessions = async (classCategoryUuid, statuses, page, size) => {

    statuses.forEach(status => {
        if (!sessionStatusEnum[status])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_STATUS);
    });

    const query = ClassCategorySession.query()
        .modify('list')
        .where('class_category_uuid', classCategoryUuid)
        .whereIn('status', statuses)

    if (page && size) {
        query = query.page(page, size)
        .then(sessionPage => {
            return ServiceHelper.toPageObj(page, size, sessionPage);
        });
    }

    return query;

}

module.exports = classCategorySessionService;