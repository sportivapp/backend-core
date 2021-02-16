const { UnsupportedOperationError } = require('../../models/errors');
const ClassCategoryParticipant = require('../../models/v2/ClassCategoryParticipant');

const ErrorEnum = {
    PARTICIPANT_REGISTERED: 'PARTICIPANT_REGISTERED',
}

const classCategoryParticipantService = {};

classCategoryParticipantService.findByIdAndUserId = async (classCategoryUuid, userId) => {

    return ClassCategoryParticipant.query()
        .where('class_category_uuid', classCategoryUuid)
        .where('user_id', userId)
        .first();

}

classCategoryParticipantService.register = async (classUuid, classCategoryUuid, user) => {

    const participant = await classCategoryParticipantService.findByIdAndUserId(classCategoryUuid, user.sub);
    if (participant)
        throw new UnsupportedOperationError(ErrorEnum.PARTICIPANT_REGISTERED);

    return ClassCategoryParticipant.query()
        .insertToTable({
            classUuid, classUuid,
            classCategoryUuid: classCategoryUuid,
            userId: user.sub,
        }, user.sub);

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

module.exports = classCategoryParticipantService;