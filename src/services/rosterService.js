const Roster = require('../models/Roster');
const RosterUserMapping = require('../models/RosterUserMapping');
const Grades = require('../models/Grades')
const Department = require('../models/Department')
const ServiceHelper = require('../helper/ServiceHelper')

const RosterService = {};

RosterService.createRosterWithDepartment = async (rosterDTO, user) => {

    const userIds = await getUserIdsFromDepartment(rosterDTO.edepartmentedepartmentid)

    rosterDTO.erosteruserlimit = userIds.length

    return Roster.query().insertToTable(rosterDTO, user.sub)
        .then(roster => addUsersToMappingByDepartment(roster))
}

function getUserIdsFromDepartment(departmentId) {
    return Grades.relatedQuery('users')
        .for(Grades.query().where('edepartmentedepartmentid', departmentId))
        .then(users => users.map(user => user.euserid))
}

function addUsersToMappingByDepartment(roster) {
    const mappingDTOList = userIds.map((userId, index) => ({
        erostererosterid: roster.erosterid,
        eusereuserid: userId,
        erosterusermappingname: `Member ${index + 1}`
    }))
    return RosterUserMapping.query().insertToTable(mappingDTOList, user.sub)
        .then(result => ({...roster, mappings: result}))
}

RosterService.createRoster = async (rosterDTO, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const result = Roster.query().insertToTable(rosterDTO, user.sub);

    await RosterService.addMember(result, user)
    return result
}

RosterService.addMember = async (roster, user) => {

    if (!roster) return

    let count = 1
    let members = []

    while (count <= roster.erosteruserlimit) {
        const dto = {
            erostererosterid: roster.erosterid,
            erosterusermappingname: `Member ${count + 1}`,
            erosterusermappingtype: 0
        }
        members.push(dto)
    }

    while (count <= roster.erosterreservelimit) {
        const dto = {
            erostererosterid: roster.erosterid,
            erosterusermappingname: `Reserve ${count + 1}`,
            erosterusermappingtype: 1
        }
        members.push(dto)
    }

    const result = await RosterUserMapping.query().insertToTable(members, user.sub);

    return {...roster, mappings: result}
}

RosterService.getAllRosters = async (timesheetId, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    return Roster.query()
        .modify('baseAttributes')
        .where('etimesheetetimesheetid', timesheetId)
        .withGraphFetched('[users.grades(baseAttributes).department(baseAttributes), ' +
            'department(baseAttributes).[parent, company(baseAttributes).parent.parent]]')
        .modifyGraph('users', builder => {
            builder.select('euserid', 'eusername')
        })
}

RosterService.getAllMemberById = async (page, size, rosterId, user) => {

    if (user.permission !== 7 && user.permission !== 8 && user.permission !== 10) return

    const membersPage = await RosterUserMapping.query().select().where('erostererosterid', rosterId).page(page, size);

    return ServiceHelper.toPageObj(page, size, membersPage);
}

RosterService.viewRosterById = async (rosterId, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const result = await Roster.query().select().where('erosterid', rosterId).first();

    return result;
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

    let updateRoster = (rosterDTO) => roster.$query()
        .updateByUserId(rosterDTO, user.sub)
        .returning('*')

    if (!roster.edepartmentedepartmentid && rosterDTO.edepartmentedepartmentid) {
        const userIds = await getUserIdsFromDepartment(rosterDTO.edepartmentedepartmentid)
        rosterDTO.erosteruserlimit = userIds.length
        updateRoster = updateRoster
            .then(roster => addUsersToMappingByDepartment(roster));
    } else if (!roster.edepartmentedepartmentid && !rosterDTO.edepartmentedepartmentid) {
        updateRoster = updateRoster
            .then(roster => RosterService.addMember(roster, user));
    }
    return updateRoster(rosterDTO)
}

RosterService.deleteRosterById = async (rosterId, user) => {

    if (user.permission !== 8 && user.permission !== 10) return

    const result = await Roster.query().delete().where('erosterid', rosterId);

    return result;
}

RosterService.updateUsersOfRosters = async (rosterDTOs, loggedInUser) => {

    let promises = []
    rosterDTOs.forEach(dto => {
        dto.users.forEach(user => {
            const promise = RosterUserMapping.query()
                .where('erostererosterid', dto.rosterId)
                .where('eusereuserid', user.name)
                .updateByUserId({
                    erosterusermappingjobdescription: user.jobDescription,
                    eusereuserid: user.id
                }, loggedInUser.sub)
            promises.push(promise)
        })
    })
    return Promise.all(promises)
}

module.exports = RosterService;