const News = require('../models/News')
const NewsView = require('../models/NewsView')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const ServiceHelper = require('../helper/ServiceHelper')

const UnsupportedOperationErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    NEWS_NOT_EXIST: 'NEWS_NOT_EXIST'
}

const newsService = {}

newsService.userInCompany = async (user) => {

    return CompanyUserMapping.query()
    .where('eusereuserid', user.sub)
    .where('ecompanyecompanyid', user.companyId)
    .first()
    .then(company => {
        if(!company) return false
        return true
    })

}

newsService.checkNewsByIdAndCompanyId = async (newsId, user) => {

    return News.query()
    .findById(newsId)
    .where('ecompanyecompanyid', user.companyId)
    .where('enewsispublished', true)
    .then(news => {
        if(!news) return false
        return true
    })

}

newsService.createNews = async (newsDTO, user) => {

    const userInCompany = await newsService.userInCompany(user)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    return News.transaction(trx => {
        return News.query(trx)
        .insertToTable(newsDTO, user.sub)
    })

}

newsService.publishNews = async (isPublish, newsId, user) => {

    const userInCompany = await newsService.userInCompany(user)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    return News.transaction(trx => {
        return News.query(trx)
        .where('enewsid', newsId)
        .where('ecompanyecompanyid', user.companyId)
        .updateByUserId({enewsispublished: isPublish}, user.sub)
        .returning('*')
        .then(news => {
            if(news.length === 0) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_NOT_EXIST)
            return news
        })
    })

}

newsService.editNews = async (newsDTO, newsId, user) => {

    const userInCompany = await newsService.userInCompany(user)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    return News.transaction(trx => {
        return News.query(trx)
        .where('enewsid', newsId)
        .where('ecompanyecompanyid', user.companyId)
        .updateByUserId(newsDTO, user.sub)
        .returning('*')
        .then(news => {
            if(news.length === 0) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_NOT_EXIST)
            return news
        })
    })

}

newsService.getNews = async (page, size, user) => {

    return News.query()
    .where('ecompanyecompanyid', user.companyId)
    .where('enewsispublished', true)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

newsService.getNewsDetail = async (newsId, user) => {

    const newsFromDB = await newsService.checkNewsByIdAndCompanyId(newsId, user)

    if(!newsFromDB) throw new NotFoundError()

    const isNewsViewed = await NewsView.query()
    .where('enewsenewsid', newsId)
    .where('eusereuserid', user.sub)
    .first()

    // if user haven't viewed this news
    if(!isNewsViewed){

        await NewsView.transaction(async trx => {

            const newsViewDTO = {
                enewsenewsid: newsId,
                eusereuserid: user.sub,
            }

            return NewsView.query(trx).insertToTable(newsViewDTO, user.sub)
    
        })

    } 

    return newsFromDB
}

newsService.generateNewsLink = async (newsId, user) => {

    const newsFromDB = await newsService.checkNewsByIdAndCompanyId(newsId, user)

    if(!newsFromDB) throw new NotFoundError() 
    
    return {newsLink: `https://org.sportiv.app/news/${newsId}`}
    
}

newsService.getUserViewCount = async (newsId) => {

    return NewsView.query()
    .where('enewsenewsid', newsId)
    .then(userList => {
        return userList.length
    })

}

newsService.deleteNews = async (newsId, user) => {

    const userInCompany = await newsService.userInCompany(user)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    return News.transaction(trx => {
        return News.query(trx)
        .where('enewsid', newsId)
        .where('ecompanyecompanyid', user.companyId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
    })

}


module.exports = newsService