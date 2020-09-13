const News = require('../models/News')
const Company = require('../models/Company')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    NEWS_IN_COMPANY_NOT_EXIST: 'NEWS_IN_COMPANY_NOT_EXIST',
    COMPANY_NOT_EXIST: 'COMPANY_NOT_EXIST'
}

const mobileNewsService = {}

mobileNewsService.getNewsDetail = async (companyId, newsId) => {

    const company = await Company.query()
    .select()
    .where('ecompanyid', companyId)
    .first()

    if(!company)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMPANY_NOT_EXIST)

    const newsFromDB = await News.query()
    .select()
    .where('enewsid', newsId)
    .where('ecompanyecompanyid', companyId)
    .first()

    if(!newsFromDB)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_IN_COMPANY_NOT_EXIST)

    return newsFromDB
}

module.exports = mobileNewsService