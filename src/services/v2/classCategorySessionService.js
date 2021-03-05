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

classCategorySessionService.checkConflictScheduleByCategoryUuidAndSessions = async (classCategoryUuid, sessions) => {

    const promises = sessions.map(session => {
        return ClassCategorySession.query()
            .where('class_category_uuid', classCategoryUuid)
            .whereBetween('start_date', [session.startDate, session.endDate])
            .andWhereBetween('end_date', [session.startDate, session.endDate])
            .first()
            .then(foundSession => {
                if (foundSession)
                    throw new UnsupportedOperationError(ErrorEnum.SCHEDULE_CONFLICT);
            });;
    });

    return Promise.all(promises);

}

classCategorySessionService.reschedule = async (classCategorySessionDTO, isRepeat, user) => {

    const session = await classCategorySessionService.findById(classCategorySessionDTO.uuid);

    if (!isRepeat) {

        await classCategorySessionService
            .checkConflictScheduleByCategoryUuidAndSessions(classCategorySessionDTO.classCategoryUuid, 
                [classCategorySessionDTO]);

        return session.$query()
            .updateByUserId(classCategorySessionDTO, user.sub)
            .returning('*');

    } else {

        const pagedSessions = await classCategorySessionService.getSessions(classCategorySessionDTO.classCategoryUuid, 
            [sessionStatusEnum.UPCOMING], 0, Number.MAX_SAFE_INTEGER);
        const upcomingSessions = pagedSessions.data;
        const startDiff = parseInt(classCategorySessionDTO.startDate) - parseInt(session.startDate);
        const endDiff = parseInt(classCategorySessionDTO.endDate) - parseInt(session.endDate);

        const updatedSessions = upcomingSessions.filter(upcomingSession => {
            
            const sessionDay = new Date(parseInt(session.startDate)).getDay();
            const upcomingSessionDay = new Date(parseInt(upcomingSession.startDate)).getDay();

            if (sessionDay === upcomingSessionDay) { 
                upcomingSession.startDate = parseInt(upcomingSession.startDate);
                upcomingSession.endDate = parseInt(upcomingSession.endDate);
                return upcomingSession;
            }
        }).map(matchedUpcomingSession => {

            matchedUpcomingSession.startDate = matchedUpcomingSession.startDate + startDiff;
            matchedUpcomingSession.endDate = matchedUpcomingSession.endDate + endDiff;

            return matchedUpcomingSession;
        });

        await classCategorySessionService
            .checkConflictScheduleByCategoryUuidAndSessions(classCategorySessionDTO.classCategoryUuid, 
                updatedSessions);

        const promises = updatedSessions.map(updatedSession => {
            return ClassCategorySession.query()
                .where('uuid', updatedSession.uuid)
                .updateByUserId(updatedSession, user.sub)
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

    return ClassCategorySession.query()
        .modify('list')
        .where('class_category_uuid', classCategoryUuid)
        .whereIn('status', statuses)
        .page(page, size)
        .then(sessionPage => {
            return ServiceHelper.toPageObj(page, size, sessionPage);
        });

}

module.exports = classCategorySessionService;