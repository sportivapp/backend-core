const classUserService = require('../../services/classUserService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getRegisteredUsersByClassId = async (req, res, next) => {

    const { classId } = req.params
    const { page = '0', size = '10' } = req.query

    try {
        
        const pageObj = await classUserService.getRegisteredUsersByClassId(parseInt(page), parseInt(size), parseInt(classId), req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch (e) {
        next(e)
    }
}

controller.getUsersPendingListByClassId = async (req, res, next) => {

    const { classId } = req.params
    const { page = '0', size = '10' } = req.query

    try {
        
        const pageObj = await classUserService.getUsersPendingListByClassId(parseInt(page), parseInt(size), parseInt(classId), req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))

    } catch (e) {
        next(e)
    }
}

controller.processRegistration = async (req, res, next) => {

    const { userClassIds, status } = req.body
    const { classId } = req.params;

    try {
        const result = await classUserService.processRegistration(classId, status.toUpperCase(), userClassIds, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = controller