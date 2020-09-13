const News = require('../models/News')
const Company = require('../models/Company')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    NEWS_NOT_EXIST: 'NEWS_NOT_EXIST',
}

const mobileNewsService = {}

mobileNewsService.getNewsDetail = async (newsId) => {

    const newsFromDB = await News.query()
    .select()
    .where('enewsid', newsId)
    .first()

    if(!newsFromDB)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_NOT_EXIST)

    return newsFromDB
}

module.exports = mobileNewsService