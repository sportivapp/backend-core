const Timesheet = require('../models/Timesheet')
const rosterService = require('./rosterService')
const shiftService = require('./shiftService')
const departmentService = require('./departmentService')
const Promise = require('bluebird')

const service = {}

service.getTimesheetById = async (timesheetId) => {
    return Timesheet.query().findById(timesheetId)
        .withGraphFetched('[shift.patterns.times, rosters.mappings(baseAttributes)]')
}

service.getTimesheets = async () => {
    return Timesheet.query()
}

service.createTimesheet = async (timesheetDTO, rosterDTOs, user) => {

    if (timesheetDTO.etimesheetrostercount !== rosterDTOs.length) return

    const shift = await shiftService.getShiftById(timesheetDTO.eshifteshiftid)

    if (!shift || shift.patterns.length === 0) return

    timesheetDTO.ecompanyecompanyid = user.companyId

    if (timesheetDTO.etimesheetgeneralstatus && !shift.eshiftgeneralstatus) return

    const timesheet = await Timesheet.query().insertToTable(timesheetDTO, user.sub)

    const departments = departmentService.getAllDepartmentbyCompanyId(0, Number.MAX_VALUE,
        'SUPERIOR', user.companyId, undefined)

    if (timesheet.etimesheetgeneralstatus) {
        return Promise.map(departments, (department) => {
            const dto = {
                erostername: department.edepartmentname,
                edepartmentedepartmentid: department.edepartmentid
            }
            return rosterService.createRosterWithDepartment(dto, user)
        }, { concurrency: 5 })
            .then(rosters => rosterService
                .assignRosterToShiftTimeGeneral(timesheet.etimesheetid, undefined, user)
                    .then(ignored => ({ ...timesheet, rosters: rosters }))
            )

    } else {
        return Promise.map(rosterDTOs, (dto) => {
            if (dto.edepartmentedepartmentid) return rosterService.createRosterWithDepartment(dto, user)
            return rosterService.createRoster(dto, user)
        }, { concurrency: 5 })
            .then(rosters => ({ ...timesheet, rosters: rosters }))

    }
}

service.updateTimesheet = async (timesheetId, timesheetDTO, rosterDTOs, user) => {

    const timesheet = await Timesheet.query().findById(timesheetId)

    const updatedTimesheet = await timesheet.$query().updateByUserId(timesheetDTO, user.sub).returning('*')

    if (timesheetDTO.etimesheetgeneralstatus) {
        return updatedTimesheet
    } else {
        return Promise.map(rosterDTOs, (roster) => {
            const id = roster.erosterid
            delete roster.erosterid
            return rosterService.updateRosterById(id, roster, user)
        }, { concurrency: 5 })
            .then(resultArr => ({ ...updatedTimesheet, rosters: resultArr }))
    }
}

service.deleteTimesheetById = async (timesheetId) => {

    return Timesheet.query().deleteById(timesheetId)
        .then(rowsAffected => rowsAffected === 1)

}

module.exports = service