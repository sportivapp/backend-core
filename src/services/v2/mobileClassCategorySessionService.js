const ClassCategorySession = require('../../models/v2/ClassCategorySession');
const sessionStatusEnum = require('../../models/enum/SessionStatusEnum');
const classCategoryParticipantSessionService = require('./mobileClassCategoryParticipantSessionService');
const { UnsupportedOperationError } = require('../../models/errors');
const classCategoryParticipantService = require('./mobileClassCategoryParticipantService');

const ErrorEnum = {
    INVALID_SESSION: 'INVALID_SESSION',
    INVALID_ONGOING_SESSION: 'INVALID_ONGOING_SESSION',
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

module.exports = classCategorySessionService;