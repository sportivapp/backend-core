const Class = require('../../models/v2/Class');
const ServiceHelper = require('../../helper/ServiceHelper');

const ErrorEnum = {
    PARTICIPANTS_EXISTED: 'PARTICIPANTS_EXISTED',
}

const classService = {};

classService.getClasses = async (page, size, keyword, industryId, cityId, companyId) => {

    let clsPromise = Class.query()
        .modify('adminList')
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
            priceRange: await classCategoryService.getClassCategoryPriceRangeByClassUuid(cls.uuid),
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

module.exports = classService;