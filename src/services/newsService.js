const News = require('../models/News')
const NewsView = require('../models/NewsView')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ModuleNameEnum = require('../models/enum/ModuleNameEnum')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const ServiceHelper = require('../helper/ServiceHelper')
const industryService = require('./industryService')
const settingService = require('./settingService')
const gradeService = require('./gradeService')
const companyService = require('./companyService')
const fileService = require('./fileService')
const { raw } = require('objection')

const UnsupportedOperationErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    NEWS_NOT_EXIST: 'NEWS_NOT_EXIST',
    INDUSTRY_NOT_FOUND: 'INDUSTRY_NOT_FOUND',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    FILE_NOT_EXIST: 'FILE_NOT_EXIST',
    NEWS_ALREADY_PUBLISHED: 'NEWS_ALREADY_PUBLISHED',
    INVALID_TYPE: 'INVALID_TYPE'
}

const NewsTypeEnum = {
    PUBLISHED: 'PUBLISHED',
    UNPUBLISHED: 'UNPUBLISHED',
    DRAFT: 'DRAFT'
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

newsService.getNewsByIdAndCompanyId = async (newsId, user) => {

    return News.query()
    .findById(newsId)
    .modify('baseAttributes')
    .where('ecompanyecompanyid', user.companyId)

}

newsService.createNews = async (newsDTO, user) => {

    const userInCompany = await companyService.isUserExistInCompany(newsDTO.ecompanyecompanyid, user.sub)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    const isAllowed = await gradeService.getAllGradesByUserIdAndCompanyId(newsDTO.ecompanyecompanyid, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))
        .then(gradeIds => settingService.isUserHaveFunctions(['C'], gradeIds, ModuleNameEnum.NEWS, newsDTO.ecompanyecompanyid))

    if (!isAllowed) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    const industry = await industryService.getIndustryById(newsDTO.eindustryeindustryid)

    if (!industry) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.INDUSTRY_NOT_FOUND)

    const file = await fileService.getFileByIdAndCreateBy(newsDTO.efileefileid, user.sub)

    if (!file) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return News.query().insertToTable(newsDTO, user.sub)

}

newsService.publishNews = async (isPublish, newsId, user) => {

    const news = await News.query()
        .where('enewsid', newsId)
        .where('ecompanyecompanyid', user.companyId)
        .first()

    if (!news) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_NOT_EXIST)

    const userInCompany = await companyService.isUserExistInCompany(news.ecompanyecompanyid, user.sub)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    if (news.enewsispublished) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_ALREADY_PUBLISHED)

    if (news.enewsispublished && news.enewsispublished !== isPublish) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_ALREADY_PUBLISHED)

    const isAllowed = await gradeService.getAllGradesByUserIdAndCompanyId(news.ecompanyecompanyid, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))
        .then(gradeIds => settingService.isUserHaveFunctions(['P'], gradeIds, ModuleNameEnum.NEWS, news.ecompanyecompanyid))

    if (!isAllowed) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    return news.$query()
        .updateByUserId({ enewsispublished: isPublish, enewsdate: Date.now() }, user.sub)
        .returning('*')

}

newsService.editNews = async (newsDTO, newsId, user) => {

    const news = await News.query()
        .where('enewsid', newsId)
        .where('ecompanyecompanyid', user.companyId)
        .first()

    if (!news) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_NOT_EXIST)

    const userInCompany = await companyService.isUserExistInCompany(news.ecompanyecompanyid, user.sub)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    if (news.enewsispublished) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_ALREADY_PUBLISHED)

    const isAllowed = await gradeService.getAllGradesByUserIdAndCompanyId(news.ecompanyecompanyid, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))
        .then(gradeIds => settingService.isUserHaveFunctions(['U'], gradeIds, ModuleNameEnum.NEWS, news.ecompanyecompanyid))

    if (!isAllowed) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    const industry = await industryService.getIndustryById(newsDTO.eindustryeindustryid)

    if (!industry) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.INDUSTRY_NOT_FOUND)

    if (newsDTO.efileefileid !== news.efileefileid) {

        const file = await fileService.getFileByIdAndCreateBy(newsDTO.efileefileid, user.sub)

        if (!file) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

        await fileService.deleteFileByIdAndCreateBy(news.efileefileid, user.sub)
    }

    return news.$query()
    .updateByUserId(newsDTO, user.sub)
    .returning('*')

}

newsService.getNews = async (pageRequest, user, filter, keyword) => {

    const { type, companyId, isPublic } = filter

    if (NewsTypeEnum.PUBLISHED !== type && NewsTypeEnum.UNPUBLISHED !== type && NewsTypeEnum.DRAFT !== type)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.INVALID_TYPE)

    let query = News.query()
        .modify('list')
        .where('enewsispublished', NewsTypeEnum.UNPUBLISHED !== type)
        .where(raw('lower("enewstitle")'), 'like', `%${keyword.toLowerCase()}%`)

    if (companyId) query = query.where('ecompanyecompanyid', companyId)

    if (isPublic) query = query.where('enewsispublic', isPublic)

    return query
    .orderBy('enewschangetime', 'DESC')
    .page(pageRequest.page, pageRequest.size)
    .then(pageObj => ServiceHelper.toPageObj(pageRequest.page, pageRequest.size, pageObj))

}

newsService.getNewsFilterByCompanyIdAndPublicStatusAndCategoryIdAndTodayDate = async (pageRequest, user, filter, keyword) => {

    const { companyId, isPublic, categoryId, today } = filter

    const { page, size } = pageRequest

    let query = News.query()
        .modify('list')
        .where('enewsispublished', true)
        .where(raw('lower("enewstitle")'), 'like', `%${keyword.toLowerCase()}%`)

    if (companyId) query = query.where('ecompanyecompanyid', companyId)

    if (isPublic !== undefined) query = query.where('enewsispublic', isPublic)

    if (categoryId) query = query.where('eindustryeindustryid', categoryId)

    if (today) {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        query = query.where('enewsdate', '>=', date.getTime())
    }

    return query
        .orderBy('enewsdate', 'DESC')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

newsService.getNewsDetail = async (newsId, user) => {

    const newsFromDB = await newsService.getNewsByIdAndCompanyId(newsId, user)

    if(!newsFromDB) throw new NotFoundError()

    return newsFromDB
}

newsService.generateNewsLink = async (newsId, user) => {

    const newsFromDB = await newsService.getNewsByIdAndCompanyId(newsId, user)

    if(!newsFromDB) throw new NotFoundError()
    
    return `https://org.sportiv.app/news/${newsId}`
    
}

newsService.getUserViewCount = async (newsId) => {

    return NewsView.query()
    .where('enewsenewsid', newsId)
    .count()
    .first()
    .then(obj => parseInt(obj.count))

}

newsService.deleteNews = async (newsId, user) => {

    const news = await News.query()
        .where('enewsid', newsId)
        .where('ecompanyecompanyid', user.companyId)
        .first()

    if (!news) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_NOT_EXIST)

    const userInCompany = await companyService.isUserExistInCompany(news.ecompanyecompanyid, user.sub)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    const isAllowed = await gradeService.getAllGradesByUserIdAndCompanyId(news.ecompanyecompanyid, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))
        .then(gradeIds => settingService.isUserHaveFunctions(['D'], gradeIds, ModuleNameEnum.NEWS, news.ecompanyecompanyid))

    if (!isAllowed) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    return news.$query()
    .delete()
    .then(rowsAffected => fileService.deleteFileByIdAndCreateBy(news.efileefileid, user.sub)
        .catch()
        .then(() => rowsAffected === 1))

}

newsService.getNewsById = async (newsId) => {

    console.log(newsId)

    return News.query()
        .findById(newsId)
        .then(news => {
            if (!news) throw new NotFoundError()
            return news
        })
}


module.exports = newsService