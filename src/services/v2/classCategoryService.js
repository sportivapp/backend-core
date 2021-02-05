const ClassCategory = require('../../models/v2/ClassCategory');
const classCategoryCoachService = require('./classCategoryCoachService');

const classCategoryService = {};

classCategoryService.initCategories = async (classId, categories, user, trx) => {

    const ctgsPromise = categories.map(category => {
        const newCategory = {};
        newCategory.classUuid = classId;
        newCategory.title = category.title;
        newCategory.description = category.description;
        newCategory.price = category.price;
        newCategory.requirements = JSON.stringify(category.requirements);
        
        return ClassCategory.query(trx)
            .insertToTable(newCategory, user.sub);
    });
    const returnedCategories = await Promise.all(ctgsPromise);

    let categoryCoachDTO = [];
    for (let i=0;i<categories.length;i++) {
        for (let j=0;j<categories[i].categoryCoachUserIds.length;j++) {
            categoryCoachDTO.push({
                classCategoryUuid: returnedCategories[i].uuid,
                userId: categories[i].categoryCoachUserIds[j],
            });
        }
    }

    await classCategoryCoachService.initCategoryCoach(categoryCoachDTO, user, trx);

    return 

};

module.exports = classCategoryService;