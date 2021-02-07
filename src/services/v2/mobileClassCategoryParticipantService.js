const { UnsupportedOperationError } = require('../../models/errors');
const ClassCategoryParticipant = require('../../models/v2/ClassCategoryParticipant');

const ErrorEnum = {
    PARTICIPANT_REGISTERED: 'PARTICIPANT_REGISTERED',
}

const classCategoryParticipantService = {};

classCategoryParticipantService.findByIdAndUserId = async (classCategoryUuid, userId) => {

    return ClassCategoryParticipant.query()
        .where('class_category_uuid', classCategoryUuid)
        .where('user_id', userId);

}

classCategoryParticipantService.register = async (classCategoryUuid, user) => {

    const participant = await classCategoryParticipantService.findByIdAndUserId(classCategoryUuid, user.sub);
    if (participant)
        throw new UnsupportedOperationError(ErrorEnum.PARTICIPANT_REGISTERED);

    return ClassCategoryParticipant.query()
        .insertToTable({
            classCategoryUuid: classCategoryUuid,
            userId: user.sub,
        }, user.sub);

}

module.exports = classCategoryParticipantService;