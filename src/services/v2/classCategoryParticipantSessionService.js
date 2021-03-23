const ClassCategoryParticipantSession = require('../../models/v2/ClassCategoryParticipantSession');

const classCategoryParticipantSessionService = {};

classCategoryParticipantSessionService.getSessionParticipants = async (sessionUuid) => {

    return ClassCategoryParticipantSession.query()
        .modify('participants')
        .where('class_category_session_uuid', sessionUuid);

}

module.exports = classCategoryParticipantSessionService;