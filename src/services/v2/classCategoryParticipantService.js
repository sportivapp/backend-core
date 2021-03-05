const ClassCategoryParticipant = require('../../models/v2/ClassCategoryParticipant');
const timeService = require('../../helper/timeService');

const classCategoryParticipantService = {};

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