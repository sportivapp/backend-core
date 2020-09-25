const shiftService = require('../../services/shiftService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.createShift = async (req, res, next) => {

    const { name, startDate, endDate, isGeneral } = req.body

    if (req.user.functions.indexOf('C8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const shiftDTO = {
        eshiftname: name,
        eshiftstartdate: startDate,
        eshiftenddate: endDate,
        eshiftgeneralstatus: isGeneral
    }

    try {
        const result = await shiftService.createShift(shiftDTO, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getAllShift = async (req, res, next) => {

    if (req.user.functions.indexOf('R8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await shiftService.getAllShift()
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getShiftById = async (req, res, next) => {

    const { shiftId } = req.params

    if (req.user.functions.indexOf('R8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await shiftService.getShiftById(shiftId)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.updateShiftById = async (req, res, next) => {

    const { shiftId } = req.params

    const { name, startDate, endDate } = req.body

    if (req.user.functions.indexOf('U8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const shiftDTO = {
        eshiftname: name,
        eshiftstartdate: startDate,
        eshiftenddate: endDate
    }

    try {
        const result = await shiftService.updateShiftById(shiftId, shiftDTO, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.deleteShiftById = async (req, res, next) => {

    const { shiftId } = req.params

    if (req.user.functions.indexOf('D8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await shiftService.deleteShiftById(shiftId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = controller