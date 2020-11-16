const News = require('../models/News')
const NewsView = require('../models/NewsView')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ModuleNameEnum = require('../models/enum/ModuleNameEnum')
const SortEnum = require('../models/enum/SortEnum')
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
    INVALID_TYPE: 'INVALID_TYPE',
    NEWS_NOT_COMPLETED: 'NEWS_NOT_COMPLETED',
    SCHEDULE_DATE_REQUIRED: 'SCHEDULE_DATE_REQUIRED',
    NOT_SCHEDULED: 'NOT_SCHEDULED'
}

const NewsTypeEnum = {
    PUBLISHED: 'PUBLISHED',
    SCHEDULED: 'SCHEDULED',
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

    if (newsDTO.efileefileid) {

        const file = await fileService.getFileByIdAndCreateBy(newsDTO.efileefileid, user.sub)

        if (!file) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    }

    if (newsDTO.eindustryeindustryid) {

        const industry = await industryService.getIndustryById(newsDTO.eindustryeindustryid)

        if (!industry) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.INDUSTRY_NOT_FOUND)

    }

    return News.query().insertToTable(newsDTO, user.sub)

}

newsService.publishNews = async (dto, newsId, user) => {

    if (dto.isScheduled && !dto.scheduleDate) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.SCHEDULE_DATE_REQUIRED)

    if (!dto.isScheduled && dto.scheduleDate) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_SCHEDULED)

    const news = await News.query()
        .where('enewsid', newsId)
        .where('ecompanyecompanyid', user.companyId)
        .first()

    if (!news) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_NOT_EXIST)

    const userInCompany = await companyService.isUserExistInCompany(news.ecompanyecompanyid, user.sub)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    if (!isCompleteNews(news)) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_NOT_COMPLETED)

    if (news.enewsispublished) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NEWS_ALREADY_PUBLISHED)

    const isAllowed = await gradeService.getAllGradesByUserIdAndCompanyId(news.ecompanyecompanyid, user.sub)
        .then(grades => grades.map(grade => grade.egradeid))
        .then(gradeIds => settingService.isUserHaveFunctions(['P'], gradeIds, ModuleNameEnum.NEWS, news.ecompanyecompanyid))

    if (!isAllowed) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    return news.$query()
        .updateByUserId({
            enewsispublished: dto.isPublish && !dto.isScheduled,
            enewsdate: dto.isPublish ? Date.now() : null,
            enewsscheduledate: dto.isScheduled ? dto.scheduleDate : null,
            enewsisscheduled: dto.isScheduled
        }, user.sub)
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

    if (newsDTO.eindustryeindustryid) {

        const industry = await industryService.getIndustryById(newsDTO.eindustryeindustryid)

        if (!industry) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.INDUSTRY_NOT_FOUND)

    }

    if (newsDTO.efileefileid !== news.efileefileid) {

        const file = await fileService.getFileByIdAndCreateBy(newsDTO.efileefileid, user.sub)

        if (!file) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

        await fileService.deleteFileByIdAndCreateBy(news.efileefileid, user.sub)
    }

    return news.$query()
    .updateByUserId(newsDTO, user.sub)
    .returning('*')

}

newsService.getNews = async (pageRequest, user, filter, keyword, sort) => {

    const { type, companyId, isPublic, categoryId } = filter

    if (NewsTypeEnum.PUBLISHED !== type && NewsTypeEnum.SCHEDULED !== type && NewsTypeEnum.DRAFT !== type)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.INVALID_TYPE)

    if (!SortEnum.typeOf(sort)) sort = SortEnum.NEWEST

    let query = News.query()
        .modify('list')
        .where(raw('lower("enewstitle")'), 'like', `%${keyword.toLowerCase()}%`)
        .where('enewsispublic', isPublic)

    if (NewsTypeEnum.PUBLISHED) query = query.where('enewsispublished', true)

    if (NewsTypeEnum.SCHEDULED) query = query.where('enewsisscheduled', true)

    if (companyId) query = query.where('ecompanyecompanyid', companyId)

    if (categoryId) query = query.where('eindustryeindustryid', categoryId)

    if (SortEnum.POPULAR === sort)
        query = query
            .select(News.relatedQuery('likes').count().as('likes'))
            .orderBy('likes', 'DESC')

    else if (SortEnum.OLDEST === sort)
        query = query.orderBy('enewsdate', 'ASC')

    else
        query = query.orderBy('enewsdate', 'DESC')

    return query
    .orderBy('enewschangetime', 'DESC')
    .page(pageRequest.page, pageRequest.size)
    .then(pageObj => ServiceHelper.toPageObj(pageRequest.page, pageRequest.size, pageObj))

}

newsService.getNewsFilterByCompanyIdAndPublicStatusAndCategoryIdAndTodayDate = async (pageRequest, filter, keyword, sort) => {

    const { companyId, isPublic, categoryId, today } = filter

    const { page, size } = pageRequest

    let query = News.query()
        .modify('list')
        .where('enewsispublished', true)
        .where(raw('lower("enewstitle")'), 'like', `%${keyword.toLowerCase()}%`)
        .where('enewsispublic', isPublic)

    if (companyId) query = query.where('ecompanyecompanyid', companyId)

    if (categoryId) query = query.where('eindustryeindustryid', categoryId)

    if (today) {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        query = query.where('enewsdate', '>=', date.getTime())
    }

    if (SortEnum.POPULAR === sort)
        query = query
            .select(News.relatedQuery('likes').count().as('likes'))
            .orderBy('likes', 'DESC')

    else if (SortEnum.OLDEST === sort)
        query = query.orderBy('enewsdate', 'ASC')

    else
        query = query.orderBy('enewsdate', 'DESC')

    return query
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

    return News.query()
        .findById(newsId)
        .modify('baseAttributes')
        .then(news => {
            if (!news) throw new NotFoundError()
            return news
        })
}

newsService.publishAllScheduledNewsInDateNow = async () => {
    const dateNow = new Date()
    dateNow.setSeconds(0)
    return News.query()
        .where('enewsscheduledate', '<=', dateNow.getTime())
        .where('enewsisscheduled', true)
        .where('enewsispublished', false)
        .patch({ enewsispublished: true, enewsdate: dateNow.getTime(), enewschangetime: dateNow.getTime() })
}

function isCompleteNews(news) {
    return (news.enewstitle && news.enewstitle !== '') &&
        (news.enewscontent && news.enewscontent !== '') &&
        (news.eindustryeindustryid)
}

module.exports = newsService