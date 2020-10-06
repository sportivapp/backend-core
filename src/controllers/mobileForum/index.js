const mobileForumService = require('../../services/mobileForumService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getThreadList = async (req, res, next) => {

    const { page = '0', size = '10' } = req.query

    try {

        const pageObj = await mobileForumService.getThreadList(page, size)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e)
    }
}

controller.getThreadDetailById = async (req, res, next) => {

    const { threadId } = req.params

    try {

        const result = await mobileForumService.getThreadDetailById(parseInt(threadId))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

module.exports = controller