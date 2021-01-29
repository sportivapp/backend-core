const NewsLike = require('../models/NewsLike')
const NewsView = require('../models/NewsView')
const SortEnum = require('../models/enum/SortEnum')
const { NotFoundError } = require('../models/errors')
const companyService = require('./companyService')
const newsService = require('./newsService')
const ServiceHelper = require('../helper/ServiceHelper')

const newsUserService = {}

newsUserService.getNews = async (pageRequest, user, companyId, categoryId, today, keyword, sort) => {

    if (!user) companyId = null

    if (!SortEnum.typeOf(sort)) sort = SortEnum.NEWEST

    let isPublic = true;
    if (companyId) {
        const isUserExistInCompany = await companyService.isUserExistInCompany(companyId, user.sub)
        if (isUserExistInCompany) isPublic = false;
    }

    const filter = { companyId, categoryId, today, isPublic: isPublic }

    return newsService.getNewsFilterByCompanyIdAndPublicStatusAndCategoryIdAndTodayDate(pageRequest, filter, keyword, sort)
}

newsUserService.getNewsDetail = async (newsId, user) => {

    const newsFromDB = await newsService.getNewsById(newsId)

    if (!newsFromDB.enewsispublished) throw new NotFoundError()

    if (!newsFromDB.enewsispublic) {
        if (!user) throw new NotFoundError()
        const isUserInCompany = await companyService.isUserExistInCompany(newsFromDB.company.ecompanyid, user.sub)
        if (!isUserInCompany) throw new NotFoundError()
    }

    if (user) {

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
    }

    const isLiked = user ? await NewsLike.query()
        .where('enewsenewsid', newsFromDB.enewsid)
        .where('eusereuserid', user.sub)
        .first() : null

    return { ...newsFromDB, isLiked: !!isLiked }
}

newsUserService.generateNewsLink = async (newsId) => {

    const newsFromDB = await newsService.getNewsById(newsId)

    if (!newsFromDB.enewsispublished) throw new NotFoundError()

    return process.env.NEWS_PREFIX_LINK + newsId
}

newsUserService.getUserViewCount = async (newsId) => {

    return NewsView.query()
        .where('enewsenewsid', newsId)
        .count()
        .first()
        .then(obj => parseInt(obj.count))
}

newsUserService.likeNews = async (newsId, user) => {

    if (!user) return false

    const news = await newsService.getNewsById(newsId)
        .catch(() => null)

    if (!news) return false

    if (!news.enewsispublished) return false

    if (!news.enewsispublic) {
        const isUserInCompany = await companyService.isUserExistInCompany(news.company.ecompanyid, user.sub)
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

    if (!user) return false

    return NewsLike.query()
        .where('enewsenewsid', newsId)
        .where('eusereuserid', user.sub)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = newsUserService