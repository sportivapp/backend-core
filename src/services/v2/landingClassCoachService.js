const { UnsupportedOperationError } = require('../../models/errors');
const ClassCoach = require('../../models/v2/ClassCoach');

const ErrorEnum = {
    EMPTY_COACH: 'EMPTY_COACH',
}

const classCoachService = {};

classCoachService.initClassCoach = async (classCoachDTO, user, trx) => {

    return ClassCoach.query(trx)
        .insertToTable(classCoachDTO, user.sub);

};

module.exports = classCoachService;