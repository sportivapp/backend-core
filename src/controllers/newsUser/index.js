const newsUserService = require('../../services/newsUserService')
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {}

controller.generateNewsLink = async (req, res, next) => {

    const { newsId } = req.params

    try {

        const result = await newsUserService.generateNewsLink(parseInt(newsId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.getNews = async (req, res, next) => {

    const { page = '0', size = '10', companyId = null } = req.query

    try {

        const pageObj = await newsUserService.getNews(parseInt(page), parseInt(size), req.user, companyId)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e)
    }
}

controller.getNewsDetail = async (req, res, next) => {

    const { newsId } = req.params

    try {

        const result = await newsUserService.getNewsDetail(parseInt(newsId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.getUserViewCount = async (req, res, next) => {

    const { newsId } = req.params

    try {

        const result = await newsUserService.getUserViewCount(parseInt(newsId))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.removeLikeNews = async (req, res, next) => {

    const { newsId } = req.params

    try {

        const result = await newsUserService.removeLikeNews(newsId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

controller.likeNews = async (req, res, next) => {

    const { newsId } = req.params

    try {

        const result = await newsUserService.likeNews(newsId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

module.exports = controller