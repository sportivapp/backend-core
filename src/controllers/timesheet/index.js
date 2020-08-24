const timesheetService = require('../../services/timesheetService')
const ResponseHelper = require('../../helper/ResponseHelper')

const controller = {}

controller.createTimesheet = async (req, res, next) => {

    const { name, shiftId, rosterCount, rosters } = req.body

    const timesheetDTO = {
        etimesheetname: name,
        etimesheetrostercount: rosterCount,
        eshifteshiftid: shiftId
    }

    const rosterDTOs = rosters.map(roster => ({
        erostername: roster.name,
        edepartmentedepartmentid: roster.departmentId,
        erosteruserlimit: roster.userLimit,
        erosterreservelimit: roster.reserveLimit
    }))

    try {
        const result = await timesheetService.createTimesheet(timesheetDTO, rosterDTOs, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getTimesheets = async (req, res, next) => {

    try {
        const result = await timesheetService.getTimesheets()
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.getTimesheetById = async (req, res, next) => {

    const { timesheetId } = req.params

    try {
        const result = await timesheetService.getTimesheetById(timesheetId)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

controller.updateTimesheetById = async (req, res, next) => {

    const { timesheetId } = req.params
    const { name, shiftId, rosterCount, rosters } = req.body

    const timesheetDTO = {
        etimesheetname: name,
        etimesheetrostercount: rosterCount,
        eshifteshiftid: shiftId
    }

    const rosterDTOs = rosters.map(roster => ({
        erosterid: roster.id,
        erostername: roster.name,
        edepartmentedepartmentid: roster.departmentId,
        erosteruserlimit: roster.userLimit,
        erosterreservelimit: roster.reserveLimit
    }))

    try {
        const result = await timesheetService.updateTimesheet(timesheetId, timesheetDTO, rosterDTOs, req.user)
        if (!result) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

controller.deleteTimesheetById = async (req, res, next) => {

    const { timesheetId } = req.params

    try {
        const result = await timesheetService.deleteTimesheetById(timesheetId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

module.exports = controller