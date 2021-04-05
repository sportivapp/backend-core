const { UnsupportedOperationError } = require('../../models/errors');
const ClassCategoryParticipantSession = require('../../models/v2/ClassCategoryParticipantSession');

const ErrorEnum = {
    INVALID_PARTICIPANT_SESSION: 'INVALID_PARTICIPANT_SESSION',
    REGISTERED_TO_SESSION: 'REGISTERED_TO_SESSION',
    INVALID_ONE_OR_MORE_SESSION: 'INVALID_ONE_OR_MORE_SESSION',
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

classCategoryParticipantSessionService.inputAbsence = async (participants, user) => {

    const promises = participants.map(participant => {

        return ClassCategoryParticipantSession.query()
            .findById(participant.uuid)
            .updateByUserId({
                isCheckIn: participant.isCheckIn,
            }, user.sub)
            .returning('*');

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

classCategoryParticipantSessionService.register = async (participantSessionDTOs, user, trx) => {

    return ClassCategoryParticipantSession.query(trx)
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
        .where('class_category_session_uuid', sessionUuid);

}

classCategoryParticipantSessionService.getSingleParticipantWithSession = async (sessionUuid, userId) => {

    return ClassCategoryParticipantSession.query()
        .modify('withSession')
        .where('class_category_session_uuid', sessionUuid)
        .where('user_id', userId)
        .first();

}

classCategoryParticipantSessionService.mySessionHistoryByCategoryUuidAndUserId = async(classCategoryUuid, userId) => {

    return ClassCategoryParticipantSession.query()
        .modify('mySessionHistory', classCategoryUuid, userId);
        
}

classCategoryParticipantSessionService.categorySessionsHistoryByCategoryUuid = async(classCategoryUuid) => {

    return ClassCategoryParticipantSession.query()
        .modify('categorySessionsHistory', classCategoryUuid);
        
}

classCategoryParticipantSessionService.checkUserRegisteredToSessions = async (sessionUuids, userId) => {

    return ClassCategoryParticipantSession.query()
        .whereIn('class_category_session_uuid', sessionUuids)
        .where('user_id', userId)
        .then(participants => {
            if (participants.length !== 0)
                throw new UnsupportedOperationError(ErrorEnum.REGISTERED_TO_SESSION);
        });

}

classCategoryParticipantSessionService.getTotalParticipantsByClassUuid = async (classUuid) => {

    return ClassCategoryParticipantSession.query()
        .where('class_uuid', classUuid)
        .countDistinct('user_id')
        .then(count => {
            return parseInt(count[0].count);
        });

}

classCategoryParticipantSessionService.getTotalParticipantsBySessionUuids = async (sessionUuids) => {

    return ClassCategoryParticipantSession.query()
        .whereIn('class_category_session_uuid', sessionUuids)
        .countDistinct('user_id')
        .then(count => {
            return parseInt(count[0].count);
        });

}

module.exports = classCategoryParticipantSessionService;