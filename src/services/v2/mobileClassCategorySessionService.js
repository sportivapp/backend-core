const ClassCategorySession = require('../../models/v2/ClassCategorySession');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const { UnsupportedOperationError } = require('../../models/errors');
const classCategoryParticipantService = require('./mobileClassCategoryParticipantService');

const ErrorEnum = {
    INVALID_SESSION: 'INVALID_SESSION',
    INVALID_ONGOING_SESSION: 'INVALID_ONGOING_SESSION',
    SCHEDULE_CONFLICT: 'SCHEDULE_CONFLICT',
}

const classCategorySessionService = {};

classCategorySessionService.startSession = async (classCategorySessionUuid, user) => {

    return ClassCategorySession.query()
        .findById(classCategorySessionUuid)
        .updateByUserId({
            status: sessionStatusEnum.ONGOING,
            startTime: Date.now(),
            startBy: user.sub,
        }, user.sub);

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

    const session = await classCategorySessionService.findById(classCategorySessionUuid);

    if (session.status !== sessionStatusEnum.ONGOING)
        throw new UnsupportedOperationError(ErrorEnum.INVALID_ONGOING_SESSION);

    const absences = await classCategoryParticipantSessionService.inputAbsence(classCategorySessionUuid, participants, user);

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

classCategorySessionService.getSessionParticipants = async (classCategoryUuid, classCategorySessionUuid, isCheckIn) => {

    const session = await classCategorySessionService.getSessionByUuid(classCategorySessionUuid);
    return classCategoryParticipantService.getSessionParticipants(session, isCheckIn);

}

classCategorySessionService.getSessionByCategoryUuidAndStatus = async (classCategoryUuid, status) => {

    return ClassCategorySession.query()
        .where('class_category_uuid', classCategoryUuid)
        .where('status', status);

}

classCategorySessionService.endSession = async (classCategorySessionUuid, user) => {

    const session = await ClassCategorySession.query()
        .findById(classCategorySessionUuid);

    const upcomingSessions = await classCategorySessionService
        .getSessionByCategoryUuidAndStatus(session.classCategoryUuid, sessionStatusEnum.UPCOMING);

    let onHold = false;
    if (upcomingSessions.length === 0)
        onHold = true;

    session.$query()
        .updateByUserId({
            status: sessionStatusEnum.DONE,
            onHold: onHold,
            endTime: Date.now(),
            endBy: user.sub,
        }, user.sub);

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
                return {
                    ...upcomingSession,
                    startDate: upcomingSession + startDiff,
                    endDate: upcomingSession + endDiff,
                }
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

classCategorySessionService.confirmParticipation = async (classCategorySessionUuid, classCategoryParticipantSessionUuid, isConfirm) => {

    await classCategorySessionService.findById(classCategorySessionUuid)
    return classCategoryParticipantSessionService.confirmParticipation(classCategoryParticipantSessionUuid, isConfirm);

}

module.exports = classCategorySessionService;