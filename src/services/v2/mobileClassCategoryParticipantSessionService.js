const { UnsupportedOperationError } = require('../../models/errors');
const ClassCategoryParticipantSession = require('../../models/v2/ClassCategoryParticipantSession');

const ErrorEnum = {
    INVALID_PARTICIPANT_SESSION: 'INVALID_PARTICIPANT_SESSION',
}

const classCategoryParticipantSessionService = {};

classCategoryParticipantSessionService.getParticipantsCountBySessionUuid = async (sessionUuid) => {

    return ClassCategoryParticipantSession.query()
        .where('class_category_session_uuid', sessionUuid)
        .count()
        .then(count => {
            return parseInt(count[0].count);
        })

}

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

classCategoryParticipantSessionService.getMyUnconfirmedSessionsByParticipantUuids = async (classCategoryParticipantUuids) => {

    return ClassCategoryParticipantSession.query()
        .modify('unconfirmedSession')
        .where('is_confirmed', null)
        .whereIn('class_category_participant_uuid', classCategoryParticipantUuids);

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

module.exports = classCategoryParticipantSessionService;