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

    const { companyId, departmentId, userId, isMultiple } = req.body

    try {
        const result = await approvalService.updateApproval(companyId, departmentId, userId, isMultiple, req.user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.addUserByApprovalId = async (req, res, next) => {

    const { approvalId } = req.params

    const { userId } = req.body

    try {
        const result = await approvalService.addUserFromApproval(approvalId, userId)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.deleteUserByApprovalId = async (req, res, next) => {

    const { approvalId, userId } = req.params

    try {
        const result = await approvalService.deleteUserFromApproval(approvalId, userId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = controller