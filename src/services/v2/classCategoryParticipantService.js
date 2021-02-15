const ClassCategoryParticipant = require('../../models/v2/ClassCategoryParticipant');

const classCategoryParticipantService = {};

classCategoryParticipantService.getParticipantsCountByClassUuid = async (classUuid) => {

    return ClassCategoryParticipant.query()
        .where('class_uuid', classUuid)
        .count()
        .then(count => {
            return parseInt(count[0].count);
        })

}

module.exports = classCategoryParticipantService;