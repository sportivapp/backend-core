const Timesheet = require('../models/Timesheet')
const rosterService = require('./rosterService')
const RosterUserMapping = require('../models/RosterUserMapping')
const ShiftRosterUserMapping = require('../models/ShiftRosterUserMapping')

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

    const timesheet = await Timesheet.query().insertToTable(timesheetDTO, user.sub)

    let rosterPromises = []

    rosterDTOs.forEach(dto => {
        dto.etimesheetetimesheetid = timesheet.etimesheetid
        if (dto.edepartmentedepartmentid)
            rosterPromises.push(rosterService.createRosterWithDepartment(dto, user))
        else
            rosterPromises.push(rosterService.createRoster(dto, user))
    })

   return Promise.all(rosterPromises)
        .then(rosters => ({ ...timesheet, rosters: rosters }))

}

service.updateTimesheet = async (timesheetId, timesheetDTO, rosterDTOs, user) => {

    const timesheet = await Timesheet.query().findById(timesheetId)

    if (!timesheet) return

    let promises = []

    const updateTimesheetQuery = timesheet.$query().updateByUserId(timesheetDTO, user.sub).returning('*')

    promises.push(updateTimesheetQuery)

    rosterDTOs.forEach(roster => {
        const id = roster.erosterid
        delete roster.erosterid
        promises.push(rosterService.updateRosterById(id, roster, user))
    })

    return Promise.all(promises)
        .then(resultArr => resultArr[0])
}

service.deleteTimesheetById = async (timesheetId) => {

    return Timesheet.query().deleteById(timesheetId)
        .then(rowsAffected => rowsAffected === 1)

}

function GetShiftRosterUserMapping(dto, userId) {
    return ShiftRosterUserMapping.query()
        .where('erostererosterid', dto.rosterId)
        .where('erosterusermappingname', dto.name)
        .first()
        .then(result => [userId, result]);
}

function saveShiftRosterUserMapping(resultArr, dto, user) {
    const userId = resultArr[0]
    const mappingDTO = {
        erostererosterId: dto.rosterId,
        eusereuserid: userId,
        erosterusermappingname: dto.name,
        eshifttimeeshifttimeid: dto.shiftTimeId
    }
    const shiftMapping = resultArr[1]
    if (shiftMapping) {
        return shiftMapping.$query().updateByUserId(mappingDTO, user.sub)
    } else {
        return ShiftRosterUserMapping.query().insertToTable(mappingDTO, user.sub)
    }
}

service.assignRosterToShiftTime = async (timesheetId, rosterUserShiftDTOList, user) => {

    const timesheet = await Timesheet.query().findById(timesheetId).withGraphFetched('shift')

    if (!timesheet) return

    const list = [
        {
            rosterId: 1,
            name: 'Member 1',
            shiftTimeId: 1
        }
    ]

    let updatePromises = []

    list.forEach(dto => {
        const promise = RosterUserMapping.query()
            .where('erostererosterid', dto.rosterId)
            .where('erosterusermappingname', dto.name)
            .first()
            .then(result => result.eusereuserid)
            .then(userId => GetShiftRosterUserMapping(dto, userId))
            .then(resultArr => saveShiftRosterUserMapping(resultArr, dto, user))
        updatePromises.push(promise)
    })

    await Promise.all(updatePromises)

    return timesheet.shift.$query()
        .withGraphFetched('patterns.times.[roster, user]')
}

module.exports = service