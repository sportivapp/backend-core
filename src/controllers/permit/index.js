const permitService = require('../../services/permitService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.createPermit = async (req, res, next) => {

    const permitRequest = req.body

    const user = req.user

    if (user.functions.indexOf('C6') === -1) return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const permitDTO = {
        eusereuserid: req.user.sub,
        epermitdescription: permitRequest.description,
        epermitstartdate: permitRequest.startDate,
        epermitenddate: permitRequest.endDate,
        epermitcreateby: req.user.sub
    }

    try {
        const result = await permitService.createPermit(permitDTO, user)
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

controller.getPermitList = async (req, res, next) => {

    const { page, size } = req.query

    const user = req.user

    if (user.functions.indexOf('R6') === -1) return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const pageObj = await permitService.getPermitList(parseInt(page), parseInt(size), user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    }catch (e) {
        next(e)
    }
}

controller.requestApproval = async (req, res, next) => {

    const { permitId } = req.params

    const user = req.user

    try {
        const result = await permitService.requestApproval(parseInt(permitId), user)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getSubordinatePermitList = async (req, res, next) => {

    const { page, size } = req.query

    const user = req.user

    if (user.functions.indexOf('R6') === -1) return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const pageObj = await permitService.getSubordinatePermitList(parseInt(page), parseInt(size), user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

controller.getPermitById = async (req, res, next) => {

    const { permitId } = req.params

    if (req.user.functions.indexOf('R6') === -1) return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result =  await permitService.getPermitById(permitId)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.updatePermitById = async (req, res, next) => {

    const { permitId } = req.params

    const permitRequest = req.body

    const user = req.user

    const permitDTO = {
        epermitdescription: permitRequest.description,
        epermitstartdate: permitRequest.startDate,
        epermitenddate: permitRequest.endDate
    }

    try {
        const result = await permitService.updatePermitById(permitId, permitDTO, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.updatePermitStatusById = async (req, res, next) => {

    const { permitId, status } = req.body

    const user = req.user

    if (user.functions.indexOf('U6') === -1) return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await permitService.updatePermitStatusById(permitId, status, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.deletePermitById = async (req, res, next) => {

    const { permitId } = req.params

    const user = req.user

    if (user.functions.indexOf('D6') === -1) return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await permitService.deletePermitById(permitId, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = controller