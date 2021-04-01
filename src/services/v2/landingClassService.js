const Class = require('../../models/v2/Class');
const ServiceHelper = require('../../helper/ServiceHelper');
const classCategoryParticipantSessionService = require('./landingClassCategoryParticipantSessionService');

const ErrorEnum = {
    PARTICIPANTS_EXISTED: 'PARTICIPANTS_EXISTED',
}

const classService = {};

classService.getClasses = async (page, size, keyword, industryId, cityId, companyId) => {

    let clsPromise = Class.query()
        .modify('landingList')
        .whereRaw(`LOWER("title") LIKE LOWER('%${keyword}%')`)

    if (industryId)
        clsPromise = clsPromise.where('industry_id', industryId);

    if (cityId)
        clsPromise = clsPromise.where('city_id', cityId);

    if (companyId)
        clsPromise = clsPromise.where('company_id', companyId);

    const pageObj = await clsPromise.page(page, size);

    const resultPromise = pageObj.results.map(async cls => {
        return {
            ...cls,
            startFrom: await classService.getClassStartFromPrice(cls.uuid),
            totalParticipants: await classCategoryParticipantSessionService.getTotalParticipantsByClassUuid(cls.uuid),
        }
    });
    
    return Promise.all(resultPromise)
        .then(cList => {
            pageObj.results = cList.map(cls => {
                cls.administrationFee = parseInt(cls.administrationFee);
                return cls;
            });
            return pageObj;
        })
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));

}

classService.getClassStartFromPrice = async (classUuid) => {

    const startFrom = await Class.query()
        .findById(classUuid)
        .modify('prices')
        .then(cls => {
            let lowestPrice = Number.MAX_VALUE;
            cls.classCategories.map(category => {
                if (category.price < lowestPrice)
                    lowestPrice = category.price;
                category.categorySessions.map(session => {
                    if (session.price < lowestPrice)
                        lowestPrice = session.price;
                });
            });
            return lowestPrice;
        });

    return parseInt(startFrom);

}

module.exports = classService;