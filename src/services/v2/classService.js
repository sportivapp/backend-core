const Class = require('../../models/v2/Class');
const classMediaService = require('./classMediaService');
const classCoachService = require('./classCoachService');
const classCategoriesService = require('./classCategoryService');
const UnsupportedOperationError = require('../../models/errors/UnsupportedOperationError');
const ServiceHelper = require('../../helper/ServiceHelper');

const ErrorEnum = {
    INVALID_COACH_ID: 'INVALID_COACH_ID',
}

const classService = {};

classService.createClass = async (classDTO, fileIds, classCoachUserIds, categories, user) => {

    categories.map(category => {
        category.categoryCoachUserIds.map(categoryUserId => {
            const foundClassCoach = classCoachUserIds.find(classUserId => classUserId === categoryUserId);
            if (!foundClassCoach)
                throw new UnsupportedOperationError(ErrorEnum.INVALID_COACH_ID);
        });
    });

    return Class.transaction(async trx => {

        const cls = await Class.query(trx)
            .insertToTable(classDTO, user.sub);

        const mediaDTO = fileIds.map(fileId => {
            return {
                classUuid: cls.uuid,
                fileId: fileId,
            }
        });

        const classCoachDTO = classCoachUserIds.map(classCoachUserId => {
            return {
                classUuid: cls.uuid,
                userId: classCoachUserId,
            }
        });

        await classMediaService.initMedia(mediaDTO, user, trx);
        await classCoachService.initClassCoach(classCoachDTO, user, trx);
        await classCategoriesService.initCategories(cls.uuid, categories, user, trx);

        return cls;

    });

};

classService.getClasses = async (page, size, keyword, industryId) => {

    let clsPromise = Class.query()
        .modify('adminList')
        .whereRaw(`LOWER("title") LIKE LOWER('%${keyword}%')`)

    if (industryId)
        clsPromise = clsPromise.where('industry_id', industryId);

    return clsPromise
        .page(page, size)
        .then(classes =>
            ServiceHelper.toPageObj(page, size, classes)
        );;

}

module.exports = classService;