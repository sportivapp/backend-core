const approvalService = require('../../services/approvalService.js')
const ResponseHelper = require('../../helper/ResponseHelper.js')

const controller = {}

controller.createApproval = async (req, res, next) => {

    const { companyId, departmentId, targetUserId, userIds, isMultiple } = req.body

    const approvalDTO = {
        ecompanyecompanyid: companyId,
        edepartmentedepartmentid: departmentId,
        etargetusereid: targetUserId
    }

    try {
        const result = await approvalService.createApproval(approvalDTO, userIds, isMultiple, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
       next(e)
    }
}

controller.getApprovalByCompanyIdAndDepartmentIdAndUserId = async (req, res, next) => {

    const { companyId, departmentId, userId } = req.body

    try {
        const result = await approvalService.getApproval(companyId, departmentId, userId)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.updateApprovalByCompanyIdAndDepartmentIdAndUserId = async (req, res, next) => {

    const { companyId, departmentId, targetUserId, isMultiple } = req.body

    const approvalDTO = {
        companyId: companyId ? companyId : null,
        departmentId: departmentId ? departmentId : null,
        targetUserId: targetUserId ? targetUserId : null,
        isMultiple
    }

    try {
        const result = await approvalService.updateApproval(approvalDTO, isMultiple, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = controller