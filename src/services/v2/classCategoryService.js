const ClassCategory = require('../../models/v2/ClassCategory');

const classCategoryService = {};

classCategoryService.initCategories = async (categoriesDTO, user, trx) => {

    

    return ClassCategory.query(trx)
        .insertToTable(categoriesDTO, user.sub);

};

module.exports = classCategoryService;