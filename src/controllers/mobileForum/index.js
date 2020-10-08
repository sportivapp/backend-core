const mobileForumService = require('../../services/mobileForumService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.createThread = async (req, res, next) => {

    const thread = req.body

    const threadDTO = {
        ethreadtitle: thread.title,
        ethreaddescription: thread.description,
        ethreadispublic: thread.isPublic,
        ecompanyecompanyid: thread.companyId,
        eteameteamid: thread.teamId
    }

    threadDTO.ecompanyecompanyid = (thread.companyId === null || thread.companyId === 0 || thread.companyId === undefined) ? null : thread.companyId
    threadDTO.eteameteamid = (thread.teamId === null || thread.teamId === 0 || thread.teamId === undefined) ? null : thread.teamId

    try {

        const result = await mobileForumService.createThread(threadDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.getThreadList = async (req, res, next) => {

    const { page = '0', size = '10', isPublic = true } = req.query
    // default value is undefined
    const { filter } = req.body

    try {

        const pageObj = await mobileForumService.getThreadList(page, size, filter, isPublic)
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