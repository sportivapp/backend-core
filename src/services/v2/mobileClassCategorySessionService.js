const ClassCategorySession = require('../../models/v2/ClassCategorySession');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const { UnsupportedOperationError } = require('../../models/errors');
const classRatingsService = require('./mobileClassRatingsService');
const classReasonsService = require('./mobileClassReasonsService');
const classComplaintsService = require('./mobileClassComplaintService');
const classComplaintEnum = require('../../models/enum/ClassComplaintEnum');

const ErrorEnum = {
    INVALID_SESSION: 'INVALID_SESSION',
    INVALID_ONGOING_SESSION: 'INVALID_ONGOING_SESSION',
    SCHEDULE_CONFLICT: 'SCHEDULE_CONFLICT',
    INVALID_COMPLAINT_CODE: 'INVALID_COMPLAINT_CODE',
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

classCategorySessionService.getSessionByCategoryUuidAndStatus = async (classCategoryUuid, status) => {

    return ClassCategorySession.query()
        .where('class_category_uuid', classCategoryUuid)
        .where('status', status);

}

classCategorySessionService.endSession = async (classCategorySessionUuid, user, trx) => {

    const session = await ClassCategorySession.query()
        .findById(classCategorySessionUuid);

    await classCategoryParticipantSessionService.updateParticipantConfirmedExpiration(classCategorySessionUuid, trx);

    return session.$query(trx)
    .updateByUserId({
        status: sessionStatusEnum.DONE,
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

classCategorySessionService.confirmParticipation = async (classCategorySessionUuid, classCategoryParticipantSessionUuid, isConfirm, user) => {

    await classCategorySessionService.findById(classCategorySessionUuid)
    return classCategoryParticipantSessionService.confirmParticipation(classCategoryParticipantSessionUuid, isConfirm, user);

}

classCategorySessionService.rate = async (classRatingsDTO, improvementCodes, user) => {

    const session = await classCategorySessionService.getSessionByUuid(classRatingsDTO.classCategorySessionUuid);
    
    classRatingsDTO.classUuid = session.classUuid;
    classRatingsDTO.classCategoryUuid = session.classCategoryUuid;

    await classRatingsService.checkExistUserRating(classRatingsDTO.classCategorySessionUuid, user);
    return classRatingsService.rate(classRatingsDTO, improvementCodes, user);

}

classCategorySessionService.reason = async (classReasonsDTO, user) => {

    const session = await classCategorySessionService.getSessionByUuid(classReasonsDTO.classCategorySessionUuid);

    classReasonsDTO.classUuid = session.classUuid;
    classReasonsDTO.classCategoryUuid = session.classCategoryUuid;

    return classReasonsService.reason(classReasonsDTO, user);

}

classCategorySessionService.complaint = async (classComplaintsDTO, user) => {

    if (!classComplaintEnum[classComplaintsDTO.code])
        throw new UnsupportedOperationError(ErrorEnum.INVALID_COMPLAINT_CODE);

    const session = await classCategorySessionService.getSessionByUuid(classComplaintsDTO.classCategorySessionUuid);

    classComplaintsDTO.classUuid = session.classUuid;
    classComplaintsDTO.classCategoryUuid = session.classCategoryUuid;

    return classComplaintsService.complaint(classComplaintsDTO, user);

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
        .modify('my', user.sub)
        .where('status', status)
        .where('class_category_uuid', categoryUuid)
        .where('start_date', '>=', Date.now())
        .orderBy('start_date', 'ASC')
        .then(sessions => sessions.map(session => {
            return session.uuid;
        }));

}

module.exports = classCategorySessionService;