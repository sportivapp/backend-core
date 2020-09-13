const mobileNewsService = require('../../services/mobileNews')
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {}

controller.getNewsDetail = async (req, res, next) => {

    const { newsId } = req.params

    try {

        const result = await mobileNewsService.getNewsDetail(newsId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

module.exports = controller