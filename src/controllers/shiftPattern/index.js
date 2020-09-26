const shiftPatternService = require('../../services/shiftPatternService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.getPatternsByShiftId = async (req, res, next) => {

    const { shiftId } = req.params

    if (req.user.functions.indexOf('R8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await shiftPatternService.getPatternsByShiftId(shiftId)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getPatternById = async (req, res, next) => {

    const { patternId } = req.params

    if (req.user.functions.indexOf('R8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await shiftPatternService.getPatternById(patternId)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.createPattern = async (req, res, next) => {

    const { shiftId } = req.params
    const { startTime, endTime, times } = req.body

    if (req.user.functions.indexOf('C8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const patternDTO = {
        startTime,
        endTime,
        times
    }

    try {
        const result = await shiftPatternService.createPattern(shiftId, patternDTO, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.updatePatternById = async (req, res, next) => {

    const { shiftId, patternId } = req.params
    const { startTime, endTime, times } = req.body

    if (req.user.functions.indexOf('U8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const patternDTO = {
        startTime,
        endTime,
        times
    }

    try {
        const result = await shiftPatternService.updatePatternById(shiftId, patternId, patternDTO, req.user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.deletePatternById = async (req, res, next) => {

    const { patternId } = req.params

    if (req.user.functions.indexOf('D8') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {
        const result = await shiftPatternService.deletePatternById(patternId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = controller