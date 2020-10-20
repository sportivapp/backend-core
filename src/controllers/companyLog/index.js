const companyLogService = require('../../services/companyLogService')
const ResponseHelper = require('../../helper/ResponseHelper')

const companyLogController = {}

companyLogController.processRequests = async (req, res, next) => {

    const { companyLogIds } = req.body

    const { status } = req.query

    try {
        const result = await companyLogService.processRequests(companyLogIds, status.toUpperCase(), req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

companyLogController.getLogList = async (req, res, next) => {

    const { page = '0', size = '10', type = 'APPLY', status = 'PENDING' } = req.query

    const { companyId } = req.params

    try {
        const pageObj = await companyLogService.getLogList(parseInt(page), parseInt(size), companyId, type, status)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

companyLogController.inviteMember = async (req, res, next) => {

    const { companyId } = req.params

    const { email } = req.body

    try {
        const result = await companyLogService.inviteMember(parseInt(companyId), email, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

companyLogController.cancelInvites = async (req, res, next) => {

    const { companyLogIds } = req.body

    try {
        const result = await companyLogService.cancelInvites(companyLogIds, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = companyLogController