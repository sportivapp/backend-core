const companyLogService = require('../../services/companyLogService')
const ResponseHelper = require('../../helper/ResponseHelper')

const companyLogController = {}

companyLogController.processRequest = async (req, res, next) => {

    const { status } = req.body

    const { companyLogId } = req.params

    try {
        const result = await companyLogService.processRequest(companyLogId, status, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

companyLogController.getPendingLogList = async (req, res, next) => {

    const { page = '0', size = '10', companyId = null, type = 'APPLY' } = req.query

    try {
        const pageObj = await companyLogService.getPendingLogList(parseInt(page), parseInt(size), companyId, type)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

companyLogController.inviteMember = async (req, res, next) => {

    const { companyId } = req.params

    const { email } = req.body

    try {
        const result = await companyLogService.inviteMember(companyId, email, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

companyLogController.cancelInvite = async (req, res, next) => {

    const { companyLogId } = req.params

    try {
        const result = await companyLogService.cancelInvite(companyLogId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = companyLogController