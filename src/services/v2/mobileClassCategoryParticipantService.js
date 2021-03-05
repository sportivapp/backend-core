const { UnsupportedOperationError } = require('../../models/errors');
const ClassCategoryParticipant = require('../../models/v2/ClassCategoryParticipant');
const classTransactionService = require('./mobileClassTransactionService');
const timeService = require('../../helper/timeService');

const ErrorEnum = {
    PARTICIPANT_REGISTERED: 'PARTICIPANT_REGISTERED',
}

const classCategoryParticipantService = {};

classCategoryParticipantService.findByClassUuidAndMonthUtcAndUserId = async (classUuid, monthUtc, userId) => {

    return ClassCategoryParticipant.query()
        .where('class_uuid', classUuid)
        .where('month_utc', monthUtc)
        .where('user_id', userId)
        .first();

}

classCategoryParticipantService.register = async (classUuid, classCategoryUuid, user) => {

    const monthUtc = timeService.thisMonthTimestampUTC();

    const participant = await classCategoryParticipantService
        .findByClassUuidAndMonthUtcAndUserId(classUuid, monthUtc, user.sub);
    if (participant)
        throw new UnsupportedOperationError(ErrorEnum.PARTICIPANT_REGISTERED);

    const month = timeService.thisMonthTimestamp();
    const oneMonthLater = month + (30 * 24 * 60 * 60 * 1000);

    return ClassCategoryParticipant.transaction(async trx => {

        const participant = await ClassCategoryParticipant.query(trx)
            .modify('register')
            .insertToTable({
                classUuid, classUuid,
                classCategoryUuid: classCategoryUuid,
                userId: user.sub,
                monthUtc: monthUtc,
                start: Date.now(),
                end: oneMonthLater,
            }, user.sub);
        await classTransactionService.generateTransaction(participant, user, trx);
        return participant;

    });

}

classCategoryParticipantService.getParticipantsCountByClassUuid = async (classUuid) => {

    return ClassCategoryParticipant.query()
        .where('class_uuid', classUuid)
        .count()
        .then(count => {
            return parseInt(count[0].count);
        })

}

classCategoryParticipantService.getParticipantsCountByClassCategoryUuid = async (classCategoryUuid) => {

    return ClassCategoryParticipant.query()
        .where('class_category_uuid', classCategoryUuid)
        .count()
        .then(count => {
            return parseInt(count[0].count);
        })

}

classCategoryParticipantService.getParticipants = async (classCategoryUuid) => {

    const monthUtc = timeService.thisMonthTimestampUTC();

    return ClassCategoryParticipant.query()
        .modify('participant')
        .where('month_utc', monthUtc)
        .where('class_category_uuid', classCategoryUuid);

}

classCategoryParticipantService.getActiveParticipantsByUserIdGroupByCategory = async (userId) => {

    const monthUtc = timeService.thisMonthTimestampUTC();

    return ClassCategoryParticipant.query()
        .modify('basic')
        .where('month_utc', '>=', monthUtc)
        .where('user_id', userId)
        .orderBy('month_utc', 'ASC')
        .then(participants => {
            let seen = {};
            return participants.filter(participant => {
                if (!seen[participant.classCategoryUuid]) {
                    seen[participant.classCategoryUuid] = true;
                    return true;
                }
                return false;
            });
        });
        
}

classCategoryParticipantService.getActiveParticipantByCategoryUuidAndUserId = async (classCategoryUuid, userId) => {

    const monthUtc = timeService.thisMonthTimestampUTC();

    return ClassCategoryParticipant.query()
        .modify('basic')
        .where('month_utc', '>=', monthUtc)
        .where('class_category_uuid', classCategoryUuid)
        .where('user_id', userId)
        .orderBy('month_utc', 'ASC')
        .first();

}

classCategoryParticipantService.isUserRegisteredInClass = async (classUuid, userId) => {

    return ClassCategoryParticipant.query()
        .modify('basic')
        .where('class_uuid', classUuid)
        .where('user_id', userId)
        .first()
        .then(participant => {
            if (participant)
                return true;
            return false;
        });

}

classCategoryParticipantService.getSessionParticipants = async (session, isCheckIn) => {

    const monthUtc = timeService.thisMonthTimestampUTC();
    let participants = ClassCategoryParticipant.query()
        .modify('participantCheckIn')
        .where('month_utc', monthUtc)
        .where('start', '<', session.startDate)
        .where('class_category_uuid', session.classCategoryUuid);

    if (isCheckIn)
        participants = participants.where('is_check_in', isCheckIn)

    return participants;

}

module.exports = classCategoryParticipantService;