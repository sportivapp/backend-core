const mobileClassUserService = require('../../services/mobileClassUserService')
const ResponseHelper = require('../../helper/ResponseHelper')

const mobileClassUserController = {}

mobileClassUserController.registerByClassId = async (req, res, next) => {

    const { classId } = req.body

    try {
        const result = await mobileClassUserService.registerByClassId(classId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

mobileClassUserController.cancelRegistrationByClassId = async (req, res, next) => {

    const { classUserId } = req.params

    try {
        const result = await mobileClassUserService.cancelRegistrationByClassUserId(classUserId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

mobileClassUserController.processRegistration = async (req, res, next) => {

    const { classUserId } = req.params

    const { status } = req.body

    try {
        const result = await mobileClassUserService.processRegistration(classUserId, status, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

mobileClassUserController.getMyClasses = async (req, res, next) => {

    const { page = '0', size = '10', companyId } = req.query

    try {
        const pageObj = await mobileClassUserService.getMyClasses(companyId, parseInt(page), parseInt(size), req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

mobileClassUserController.getHistoryClasses = async (req, res, next) => {

    const { page = '0', size = '10', companyId } = req.query

    try {
        const pageObj = await mobileClassUserService.getHistoryClasses(companyId, parseInt(page), parseInt(size), req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

mobileClassUserController.getHistoryClassById = async (req, res, next) => {

    const { classUserId } = req.params

    try {
        const pageObj = await mobileClassUserService.getHistoryClassById(classUserId, req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

module.exports = mobileClassUserController