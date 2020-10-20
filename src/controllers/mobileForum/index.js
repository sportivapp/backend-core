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
        eteameteamid: thread.teamId,
        efileefileid: thread.fileId
    }

    threadDTO.ecompanyecompanyid = ( thread.companyId === 0 || thread.companyId === undefined) ? null : thread.companyId
    threadDTO.eteameteamid = ( thread.teamId === 0 || thread.teamId === undefined) ? null : thread.teamId
    threadDTO.efileefileid = ( thread.fileId === 0 || thread.fileId === undefined) ? null : thread.fileId
    threadDTO.ethreadispublic = ( threadDTO.ecompanyecompanyid === null || threadDTO.eteameteamid === null) ? true : threadDTO.ethreadispublic

    try {

        const result = await mobileForumService.createThread(threadDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.updateThreadById = async (req, res, next) => {

    const { threadId } = req.params
    const thread = req.body

    const threadDTO = {
        ethreadtitle: thread.title,
        ethreaddescription: thread.description,
        ethreadispublic: thread.isPublic,
        ethreadlock: thread.lockStatus
    }

    threadDTO.efileefileid = ( thread.fileId === 0 || thread.fileId === undefined) ? null : thread.fileId
    
    try {

        const result = await mobileForumService.updateThreadById(parseInt(threadId), threadDTO, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

controller.getThreadList = async (req, res, next) => {
    
    const { page = '0', size = '10', isPublic = true, companyId = null, teamId = null } = req.query
    // default value is undefined
    const filter = {
        companyId: companyId,
        teamId: teamId,
    }

    try {

        const pageObj = await mobileForumService.getThreadList(page, size, filter, isPublic)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        
    } catch (e) {
        next(e)
    }
}

controller.getMyOrganizationListWithAccess = async (req, res, next) => {

    const { page = '0', size = '10', type = 'PRIVATE', keyword = '' } = req.query

    try {

        const pageObj = await mobileForumService.getUserOrganizationListWithPermission(parseInt(page), parseInt(size), keyword, type, req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch (e) {
        next(e)
    }
}

controller.getMyTeamListWithAccess = async (req, res, next) => {

    const { page = '0', size = '10', type = 'PRIVATE', keyword = '' } = req.query

    try {

        const pageObj = await mobileForumService.getUserTeamListWithAdminStatus(parseInt(page), parseInt(size), keyword, type, req.user)
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

controller.deleteThreadById = async (req, res, next) => {

    const { threadId } = req.params

    try {

        const result = await mobileForumService.deleteThreadById(parseInt(threadId), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e)
    }
}

module.exports = controller