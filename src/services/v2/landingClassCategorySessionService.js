const ClassCategorySession = require('../../models/v2/ClassCategorySession');

const classCategorySessionService = {};

classCategorySessionService.initCategorySession = async (sessionDTO, user, trx) => {

    return ClassCategorySession.query(trx)
        .insertToTable(sessionDTO, user.sub);

};

module.exports = classCategorySessionService;