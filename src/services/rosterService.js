const Roster = require('../models/Roster');
const RosterUserMapping = require('../models/RosterUserMapping');
const ShiftRosterUserMapping = require('../models/ShiftRosterUserMapping')
const Grades = require('../models/Grades')
const Department = require('../models/Department')
const Timesheet = require('../models/Timesheet')
const Project = require('../models/Project')
const todoListService = require('./todoListService')
const ServiceHelper = require('../helper/ServiceHelper')
const { Promise } = require('bluebird')

const RosterService = {};

RosterService.createRosterWithDepartment = async (rosterDTO, user) => {

    const userIds = await getUserIdsFromDepartment(rosterDTO.edepartmentedepartmentid)

    rosterDTO.erosteruserlimit = userIds.length
    rosterDTO.erosterreservelimit = 0

    return Roster.query().insertToTable(rosterDTO, user.sub)
        .then(roster => addUsersToMappingByDepartment(roster, userIds, user))
}

function getUserIdsFromDepartment(departmentId) {
    return Grades.relatedQuery('users')
        .for(Grades.query().where('edepartmentedepartmentid', departmentId))
        .distinct('euserid')
        .then(users => users.map(user => user.euserid))
}

function addUsersToMappingByDepartment(roster, userIds, user) {
    const mappingDTOList = userIds.map((userId, index) => ({
        erostererosterid: roster.erosterid,
        eusereuserid: userId,
        erosterusermappingname: `Member ${index + 1}`,
        erosterusermappingtype: 0
    }))
    return RosterUserMapping.query().insertToTable(mappingDTOList, user.sub)
        .then(result => ({...roster, mappings: result}))
}

RosterService.createRoster = async (rosterDTO, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    return Roster.query().insertToTable(rosterDTO, user.sub)
        .then(roster => RosterService.addMember(roster, user));
}

RosterService.addMember = async (roster, user) => {

    if (!roster) return

    let count = 1
    let members = []

    while (count <= roster.erosteruserlimit) {
        const dto = {
            erostererosterid: roster.erosterid,
            erosterusermappingname: `Member ${count}`,
            erosterusermappingtype: 0
        }
        members.push(dto)
        count++
    }

    count = 1
    while (count <= roster.erosterreservelimit) {
        const dto = {
            erostererosterid: roster.erosterid,
            erosterusermappingname: `Reserve ${count}`,
            erosterusermappingtype: 1
        }
        members.push(dto)
        count++
    }

    return RosterUserMapping.query().insertToTable(members, user.sub)
        .then(result => ({ ...roster, mappings: result }))
}

RosterService.getAllRosters = async (timesheetId, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    return Roster.query()
        .modify('baseAttributes')
        .where('etimesheetetimesheetid', timesheetId)
        .withGraphFetched('[mappings(baseAttributes)' +
            '.user(baseAttributes)' +
            '.grades(baseAttributes)' +
            '.department(baseAttributes), ' +
            'department(baseAttributes)' +
            '.[parent(baseAttributes), company(baseAttributes)' +
            '.parent(baseAttributes)' +
            '.parent(baseAttributes)]]')
}

RosterService.getAllMemberById = async (page, size, rosterId, user) => {

    if (user.permission !== 7 && user.permission !== 8 && user.permission !== 10) return

    const membersPage = await RosterUserMapping.query().select().where('erostererosterid', rosterId).page(page, size);

    return ServiceHelper.toPageObj(page, size, membersPage);
}

RosterService.viewRosterById = async (rosterId, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    return Roster.query().select()
        .modify('baseAttributes')
        .where('erosterid', rosterId)
        .first()
        .withGraphFetched('[mappings(baseAttributes)' +
            '.user(baseAttributes)' +
            '.grades(baseAttributes)' +
            '.department(baseAttributes), ' +
            'department(baseAttributes)' +
            '.[parent(baseAttributes), company(baseAttributes)' +
            '.parent(baseAttributes)' +
            '.parent(baseAttributes)]]');
}

RosterService.updateRosterById = async (rosterId, rosterDTO, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const roster = await Roster.query().findById(rosterId)

    if (!roster) return

    if (rosterDTO.edepartmentedepartmentid) {
        const department = await Department.query().findById(rosterDTO.edepartmentedepartmentid)
        if (!department) return
    }

    await RosterUserMapping.query().where('erostererosterid', rosterId).delete()

    let updateRoster = roster.$query()
        .updateByUserId(rosterDTO, user.sub)
        .returning('*')

    if ((!roster.edepartmentedepartmentid && rosterDTO.edepartmentedepartmentid)) {
        const userIds = await getUserIdsFromDepartment(rosterDTO.edepartmentedepartmentid)
        rosterDTO.erosteruserlimit = userIds.length
        return roster.$query()
            .updateByUserId(rosterDTO, user.sub)
            .returning('*')
            .then(roster => addUsersToMappingByDepartment(roster, userIds, user));
    } else if (roster.edepartmentedepartmentid && (roster.edepartmentedepartmentid !== rosterDTO.edepartmentedepartmentid)) {
        const userIds = await getUserIdsFromDepartment(rosterDTO.edepartmentedepartmentid)
        rosterDTO.erosteruserlimit = userIds.length
        return roster.$query()
            .updateByUserId(rosterDTO, user.sub)
            .returning('*')
            .then(roster => addUsersToMappingByDepartment(roster, userIds, user));
    } else if (!roster.edepartmentedepartmentid && !rosterDTO.edepartmentedepartmentid) {
        return roster.$query()
            .updateByUserId(rosterDTO, user.sub)
            .returning('*')
            .then(roster => RosterService.addMember(roster, user));
    } else {
        return updateRoster
            .then(roster => roster.$query().withGraphFetched('mappings'))
    }
}

RosterService.deleteRosterById = async (rosterId, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const result = await Roster.query().delete().where('erosterid', rosterId);

    return result;
}

RosterService.updateUsersOfRosters = async (projectId, rosterDTOs, loggedInUser) => {

    let promises = []
    let shiftMappingPromises = []

    rosterDTOs.forEach(dto => {
        dto.users.forEach(user => {
            const promise = RosterUserMapping.query()
                .where('erostererosterid', dto.id)
                .where('erosterusermappingname', user.name)
                .updateByUserId({
                    erosterusermappingjobdescription: user.jobDescription,
                    eusereuserid: user.id
                }, loggedInUser.sub)

            if (user.id) {
                const anotherPromise = ShiftRosterUserMapping.query()
                    .where('erostererosterid', dto.id)
                    .where('erosterusermappingname', user.name)
                    .first()
                    .updateByUserId({ eusereuserid: user.id, eprojecteprojectid: parseInt(projectId) }, loggedInUser.sub)
                    .returning('*')
                shiftMappingPromises.push(anotherPromise)
            }
            promises.push(promise)
        })
    })
    return Promise.all(promises)
        .then(result => Promise.all(shiftMappingPromises).then(resultMapping => [result, resultMapping]))
        .then(resultArr => todoListService.createTodoListByProject(projectId, resultArr[1], loggedInUser)
            .then(ignored => resultArr[0]))
}

function GetShiftRosterUserMapping(dto) {
    console.log(dto)
    return ShiftRosterUserMapping.query()
        .where('erostererosterid', dto.erostererosterid)
        .where('erosterusermappingname', dto.erosterusermappingname)
        .first()
        .then(result => [result, dto])
}

function saveShiftRosterUserMapping(mapping, rosterUserMapping, dto, user) {
    const mappingDTO = {
        erostererosterid: dto.rosterId,
        erosterusermappingname: dto.name,
        eshifttimeeshifttimeid: dto.shiftTimeId,
        eshiftdaytime: dto.dayTime,
        eusereuserid: rosterUserMapping ? rosterUserMapping.eusereuserid: dto.userId,
        eshiftgeneralstatus: false
    }
    if (mapping) {
        return mapping.$query().updateByUserId(mappingDTO, user.sub)
    } else {
        return ShiftRosterUserMapping.query().insertToTable(mappingDTO, user.sub)
    }
}

RosterService.assignRosterToShiftTime = async (timesheetId, mappings, user) => {

    const timesheet = await Timesheet.query().findById(timesheetId).withGraphFetched('shift')

    if (!timesheet) return

    const reserveCount = mappings.filter(dto => dto.name.includes('Reserve')).length
    if (reserveCount > 0) return

    let updatePromises = []

    mappings.forEach(dto => {
        const promise = RosterUserMapping.query()
            .where('erostererosterid', dto.rosterId)
            .where('erosterusermappingname', dto.name)
            .first()
            .then(result => GetShiftRosterUserMapping(result))
            .then(resultArr => saveShiftRosterUserMapping(resultArr[0], resultArr[1], dto, user))
        updatePromises.push(promise)
    })

    await Promise.all(updatePromises)

    return timesheet.shift.$query()
        .withGraphFetched('patterns(baseAttributes).times(baseAttributes).mappings(baseAttributes).roster(idAndName)')
}

RosterService.assignRosterToShiftTimeGeneral = async (timesheetId, user) => {

    const timesheet = await Timesheet.query().findById(timesheetId).withGraphFetched('[shift.patterns.times, rosters.mappings.user]')

    if (!timesheet || !timesheet.etimesheetgeneralstatus) return

    let updatePromises = []
    let dtoList = []

    timesheet.rosters.forEach(roster => {
        roster.mappings.forEach(mapping => {
            const dto = {
                rosterId: roster.erosterid,
                name: mapping.erosterusermappingname,
                userId: mapping.user.euserid
            }
            dtoList.push(dto)
        })
    })

    let shiftTimeIds = []

    timesheet.shift.patterns.forEach(pattern => {
        let timeIds = pattern.times.map(time => time.eshifttimeid)
        shiftTimeIds.concat(timeIds)
    })

    let mappings = []

    shiftTimeIds.forEach(timeId => {
        const dtoWithShiftTimeIdList = dtoList.map(dto => {
            dto[shiftTimeId] = timeId
            return dto
        })
        mappings.concat(dtoWithShiftTimeIdList)
    })

    mappings.forEach(dto => {
        const promise = RosterUserMapping.query()
            .where('erostererosterid', dto.rosterId)
            .where('erosterusermappingname', dto.name)
            .first()
            .then(result => GetShiftRosterUserMapping(result))
            .then(resultArr => saveShiftRosterUserMapping(resultArr[0], undefined, dto, undefined, user))
        updatePromises.push(promise)
    })

    await Promise.all(updatePromises)

    return timesheet.shift.$query()
        .withGraphFetched('patterns.times.mappings.roster(idAndName)')
}

module.exports = RosterService;