const ClassReasons = require('../../models/v2/ClassReasons');

mobileClassReasonsService = {};

mobileClassReasonsService.reason = async (classReasonsDTO, user) => {

    return ClassReasons.query()
        .insertToTable(classReasonsDTO, user.sub);

}

module.exports = mobileClassReasonsService;