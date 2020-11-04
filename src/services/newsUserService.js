const NewsLike = require('../models/NewsLike')
const NewsView = require('../models/NewsView')
const { NotFoundError } = require('../models/errors')
const companyService = require('./companyService')
const newsService = require('./newsService')

const NewsTypeEnum = {
    PUBLISHED: 'PUBLISHED',
    UNPUBLISHED: 'UNPUBLISHED',
    DRAFT: 'DRAFT'
}

const newsUserService = {}

newsUserService.getNews = async (page, size, user, companyId) => {

    return newsService.getNews(page, size, user, NewsTypeEnum.PUBLISHED, companyId, !companyId)
}

newsUserService.getNewsDetail = async (newsId, user) => {

    const newsFromDB = await newsService.getNewsById(newsId)

    if (!newsFromDB.enewsispublished) throw new NotFoundError()

    const isNewsViewed = await NewsView.query()
        .where('enewsenewsid', newsId)
        .where('eusereuserid', user.sub)
        .first()

    // if user haven't viewed this news
    if (!isNewsViewed) {

        const newsViewDTO = {
            enewsenewsid: newsId,
            eusereuserid: user.sub,
        }

        await NewsView.query().insertToTable(newsViewDTO, user.sub)

    }

    return newsFromDB
}

newsUserService.generateNewsLink = async (newsId, user) => {

    await newsService.getNewsDetail(newsId, user)

    return `https://org.sportiv.app/news/${newsId}`
}

newsUserService.getUserViewCount = async (newsId) => {

    return NewsView.query()
        .where('enewsenewsid', newsId)
        .count()
        .first()
        .then(obj => parseInt(obj.count))
}

newsUserService.likeNews = async (newsId, user) => {

    const news = await newsService.getNewsById(newsId)
        .catch(() => null)

    if (!news) return false

    if (!news.enewsispublished) return false

    if (!news.enewsispublic) {
        const isUserInCompany = await companyService.isUserExistInCompany(news.ecompanyecompanyid, user.sub)
        if (!isUserInCompany) return false
    }

    const newsLike = await NewsLike.query()
        .where('enewsenewsid', newsId)
        .where('eusereuserid', user.sub)
        .first()

    if (newsLike) return false

    return NewsLike.query()
        .insertToTable({ enewsenewsid: newsId, eusereuserid: user.sub }, user.sub)
        .then(() => true)
}

newsUserService.removeLikeNews = async (newsId, user) => {

    return NewsLike.query()
        .where('enewsenewsid', newsId)
        .where('eusereuserid', user.sub)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = newsUserService