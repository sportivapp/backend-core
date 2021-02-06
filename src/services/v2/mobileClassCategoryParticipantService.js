const ClassCategoryParticipant = require('../../models/v2/ClassCategoryParticipant');

const classCategoryParticipantService = {};

classCategoryParticipantService.register = async (classCategoryUuid, user) => {

    return ClassCategoryParticipant.query()
        .insertToTable({
            classCategoryUuid: classCategoryUuid,
            userId: user.sub,
        }, user.sub);

}

module.exports = classCategoryParticipantService;