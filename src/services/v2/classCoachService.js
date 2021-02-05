const ClassCoach = require('../../models/v2/ClassCoach');

const classCoachService = {};

classCoachService.initClassCoach = async (classCoachDTO, user, trx) => {

    return ClassCoach.query(trx)
        .insertToTable(classCoachDTO, user.sub);

};

module.exports = classCoachService;