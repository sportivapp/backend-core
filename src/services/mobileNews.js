const News = require('../models/News')
const Company = require('../models/Company')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {}

const mobileNewsService = {}

mobileNewsService.getNewsDetail = async (newsId) => {

    const newsFromDB = await News.query()
    .select()
    .where('enewsid', newsId)
    .first()

    if(!newsFromDB)
        throw new NotFoundError

    return newsFromDB
}

module.exports = mobileNewsService