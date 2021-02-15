const ClassCategoryCoach = require('../../models/v2/ClassCategoryCoach');

const classCategoryCoachService = {};

classCategoryCoachService.initCategoryCoach = async (categoryCoachDTO, user, trx) => {

    return ClassCategoryCoach.query(trx)
        .insertToTable(categoryCoachDTO, user.sub);

};

module.exports = classCategoryCoachService;