const newsService = require('../../services/newsService')
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {}

controller.createNews = async (req, res, next) => {

    const news = req.body

    const newsDTO = {
        enewsdate: news.date,
        enewstitle: news.title,
        enewscontent: news.content,
        ecompanyecompanyid: req.user.companyId,
        efileefileid: news.fileId
    }

    // insert permission here?

    try {

        const result = await newsService.createNews(newsDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.generateNewsLink = async (req, res, next) => {

    const { newsId } = req.params

    // insert permission here?

    try {

        const result = await newsService.generateNewsLink(parseInt(newsId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.publishNews = async (req, res, next) => {

    const { newsId } = req.params
    const { isPublish } = req.body

    // insert permission here?

    try {

        const result = await newsService.publishNews(isPublish, parseInt(newsId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.editNews = async (req, res, next) => {

    const { newsId } = req.params

    const news = req.body

    const newsDTO = {
        enewsdate: news.date,
        enewstitle: news.title,
        enewscontent: news.content,
        ecompanyecompanyid: req.user.companyId,
        efileefileid: news.fileId
    }

    // insert permission here?

    try {

        const result = await newsService.editNews(newsDTO, parseInt(newsId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.getNews = async (req, res, next) => {

    const { page = '0', size = '10', type = 'NOTPUBLISH' } = req.query

    try {

        const pageObj = await newsService.getNews(parseInt(page), parseInt(size), req.user, type.toUpperCase())
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e)
    }
}

controller.getNewsDetail = async (req, res, next) => {

    const { newsId } = req.params

    try {

        const result = await newsService.getNewsDetail(parseInt(newsId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.getUserViewCount = async (req, res, next) => {

    const { newsId } = req.params

    try {

        const result = await newsService.getUserViewCount(parseInt(newsId))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.deleteNews = async (req, res, next) => {

    const { newsId } = req.params

    // insert permission here?

    try {

        const result = await newsService.deleteNews(parseInt(newsId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

module.exports = controller