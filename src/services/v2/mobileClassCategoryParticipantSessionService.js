const { UnsupportedOperationError } = require('../../models/errors');
const ClassCategoryParticipantSession = require('../../models/v2/ClassCategoryParticipantSession');
const timeService = require('../../helper/timeService');

const ErrorEnum = {
    INVALID_PARTICIPANT_SESSION: 'INVALID_PARTICIPANT_SESSION',
}

const classCategoryParticipantSessionService = {};

classCategoryParticipantSessionService.getSessionUuidsByUserId = async (userId) => {

    return ClassCategoryParticipantSession.query()
        .where('user_id', userId)
        .then(mappings => 
                mappings.map(mapping => {
                return mapping.classCategorySessionUuid;
            })
        );

}

classCategoryParticipantSessionService.inputAbsence = async (classCategorySessionUuid, participants, user) => {

    const promises = participants.map(participant => {

        return ClassCategoryParticipantSession.query()
            .insertToTable({
                classCategorySessionUuid: classCategorySessionUuid,
                classCategoryParticipantUuid: participant.uuid,
                isCheckIn: participant.isCheckIn,
            }, user.sub);

    });

    return Promise.all(promises);

};

classCategoryParticipantSessionService.getMyUnconfirmedSessions = async (classCategoryUuid, user) => {

    const now = Date.now();

    return ClassCategoryParticipantSession.query()
        .modify('unconfirmedSession')
        .where('is_confirmed', null)
        .whereNot('confirmed_expiration', null)
        .where('confirmed_expiration', '>=', now)
        .where('class_category_uuid', classCategoryUuid)
        .where('user_id', user.sub);

}

classCategoryParticipantSessionService.findById = async (classCategoryParticipantSessionUuid) => {

    return ClassCategoryParticipantSession.query()
        .findById(classCategoryParticipantSessionUuid)
        .then(participantSession => {
            if (!participantSession)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_PARTICIPANT_SESSION);
            return participantSession;
        });

}

classCategoryParticipantSessionService.confirmParticipation = async (classCategoryParticipantSessionUuid, isConfirm, user) => {

    const participantSession = await classCategoryParticipantSessionService.findById(classCategoryParticipantSessionUuid);

    return participantSession.$query()
        .updateByUserId({
            isConfirmed: isConfirm,
        }, user.sub)
        .returning('*');

}

classCategoryParticipantSessionService.updateParticipantConfirmedExpiration = async (classCategorySessionUuid, trx) => {

    const twoDays = 2 * 60 * 60 * 1000;

    return ClassCategoryParticipantSession.query(trx)
        .where('class_category_session_uuid', classCategorySessionUuid)
        .patch({
            confirmedExpiration: Date.now() + twoDays,
        });

}

classCategoryParticipantSessionService.register = async (participantSessionDTOs, user) => {

    return ClassCategoryParticipantSession.query()
        .insertToTable(participantSessionDTOs, user.sub);

}

classCategoryParticipantSessionService.getMySessionUuids = async (user) => {

    return ClassCategoryParticipantSession.query()
        .where('user_id', user.sub)
        .then(participantSessions => participantSessions.map(participantSession =>  {
            return participantSession.classCategorySessionUuid;
        }));

}

classCategoryParticipantSessionService.getSessionParticipants = async (sessionUuid) => {

    return ClassCategoryParticipantSession.query()
        .modify('participants')
        .where('class_category_session_uuid', sessionUuid)
        .where('is_check_in', null);

}

module.exports = classCategoryParticipantSessionService;