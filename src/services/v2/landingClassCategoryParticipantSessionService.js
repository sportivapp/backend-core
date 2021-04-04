const ClassCategoryParticipantSession = require('../../models/v2/ClassCategoryParticipantSession');

const classCategoryParticipantSessionService = {};

classCategoryParticipantSessionService.getTotalParticipantsByClassUuid = async (classUuid) => {

    return ClassCategoryParticipantSession.query()
        .where('class_uuid', classUuid)
        .countDistinct('user_id')
        .then(count => {
            return parseInt(count[0].count);
        });

}

module.exports = classCategoryParticipantSessionService;