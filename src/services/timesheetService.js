const Timesheet = require('../models/Timesheet')
const rosterService = require('./rosterService')
const shiftService = require('./shiftService')
const Promise = require('bluebird')

const service = {}

service.getTimesheetById = async (timesheetId) => {
    return Timesheet.query().findById(timesheetId)
        .withGraphFetched('shift')
}

service.getTimesheets = async () => {
    return Timesheet.query().withGraphFetched('shift')
}

service.createTimesheet = async (timesheetDTO, rosterDTOs, user) => {

    if (timesheetDTO.etimesheetrostercount !== rosterDTOs.length) return

    const shift = await shiftService.getShiftById(timesheetDTO.eshifteshiftid)

    if (!shift || shift.patterns.length === 0) return

    const timesheet = await Timesheet.query().insertToTable(timesheetDTO, user.sub)

   return Promise.map(rosterDTOs, (dto) => {
       if (dto.edepartmentedepartmentid) return rosterService.createRosterWithDepartment(dto, user)
       return rosterService.createRoster(dto, user)
   }, { concurrency: 5 })
       .then(rosters => ({ ...timesheet, rosters: rosters }))

}

service.updateTimesheet = async (timesheetId, timesheetDTO, rosterDTOs, user) => {

    const timesheet = await Timesheet.query().findById(timesheetId)

    if (!timesheet) return

    const updatedTimesheet = await timesheet.$query().updateByUserId(timesheetDTO, user.sub).returning('*')

    return Promise.map(rosterDTOs, (roster) => {
        const id = roster.erosterid
        delete roster.erosterid
        return rosterService.updateRosterById(id, roster, user)
    }, { concurrency: 5 })
        .then(resultArr => ({ ...updatedTimesheet, rosters: resultArr }))
}

service.deleteTimesheetById = async (timesheetId) => {

    return Timesheet.query().deleteById(timesheetId)
        .then(rowsAffected => rowsAffected === 1)

}

module.exports = service