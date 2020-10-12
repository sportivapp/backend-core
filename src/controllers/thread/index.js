const ResponseHelper = require('../../helper/ResponseHelper')
const threadService = require('../../services/threadService')

const threadController = {}

threadController.getAllThreads = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '', isPublic = true, c, t, sort = 'NEWEST' } = req.query

    const filter = {
        companyId: c ? c : null,
        teamId: t ? t : null,
        sort: sort
    }

    try {
        const result = await threadService.getAllThreads(parseInt(page), parseInt(size), keyword.toLowerCase(), isPublic, filter)
        return res.status(200).json(ResponseHelper.toPageResponse(result.data, result.paging))
    }catch (e) {
        next(e)
    }
}

threadController.getThreadById = async (req, res, next) => {

    const { threadId } = req.params

    try {
        const result = await threadService.getThreadById(threadId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

threadController.createThread = async (req, res, next) => {

    const { title, description, companyId, teamId, isPublic, moderatorIds } = req.body

    const threadDTO = {
        ethreadtitle: title,
        ethreaddescription: description,
        efileefileid: fileId,
        ecompanyecompanyid: companyId,
        ethreadlock: false,
        eteameteamid: teamId
    }

    try {
        const result = await threadService.createThread(threadDTO, isPublic, moderatorIds, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

threadController.updateThread = async (req, res, next) => {

    const { threadId } = req.params

    const { title, description, lock, isPublic, moderatorIds } = req.body

    const threadDTO = {
        ethreadtitle: title,
        ethreaddescription: description,
        ethreadlock: lock,
        efileefileid: fileId
    }

    try {
        const result = await threadService.updateThread(threadId, threadDTO, isPublic, moderatorIds, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

threadController.deleteThreadById = async (req, res, next) => {

    const { threadId } = req.params

    try {
        const result = await threadService.deleteThreadById(threadId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = threadController