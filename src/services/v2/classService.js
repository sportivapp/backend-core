const Class = require('../../models/v2/Class');
const classCategoriesService = require('./classCategoryService');

const classService = {};

classService.createClass = async (classDTO, fileIds, classCompanyUserIds, categories, classCategoryCompanyUserIds, user) => {

    return Class.transaction(async trx => {

        const cls = await Class.query(trx)
            .insertToTable(classDTO, user.sub);

        const mediaDTO = fileIds.map(fileId => {
            return {
                classUuid: cls.uuid,
                fileId: fileId,
            }
        });

        const categoriesDTO = categories.map(category => {
            category.classUuid = cls.uuid;
            category.requirements = JSON.stringify(category.requirements);
            return category;
        });

        // await classMediaService.initMediaTran(fileIds, trx);
        // await classCoachService.initClassCoach(classCompanyUserIds, trx);
        await classCategoriesService.initCategories(categoriesDTO, user, trx);
        // await classCategoryCoachService.initClassCategoryCoach(classCategoryCompanyUserIds, trx);

        return cls;

    });

};

module.exports = classService;