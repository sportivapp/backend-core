const Permit = require('../models/Permit')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper')
const Roster = require('../models/Roster')
const RosterUserMapping = require('../models/RosterUserMapping')
const PermitApprovalMapping = require('../models/PermitApprovalMapping')
const Grades = require('../models/Grades')
const UserPositionMapping = require('../models/UserPositionMapping')

const permitService = {}

permitService.getPermitList = async (page, size, user) => {

    const permitPage = await Permit.query()
        .modify('findByUserId', user.sub)
        .modify('notDeleted')
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitPage)
}

permitService.getSubordinatePermitList = async (page, size, user) => {

    const mappingSubQuery = PermitApprovalMapping.query().where('eusereuserid', user.sub)
        .where('epermitapprovalmappingstatus', false)

    const permitApprovalPage = await PermitApprovalMapping.relatedQuery('permits')
        .for(mappingSubQuery)
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitApprovalPage)
}

permitService.getPermitById = async (permitId, user) => {

    const permit = await Permit.query()
        .findById(permitId)
        .modify('notDeleted')
        .withGraphFetched('user(notDeleted)')
        .first()

    if(!permit || !permit.user) return
    else if (permit.user.euserpermission === user.permission && permit.user.euserid !== user.sub) return
    else return permit
}

async function getRosterSupervisorIdQuery(rosterId) {
    return Roster.relatedQuery('supervisor')
        .for(rosterId)
        .first()
        .then(user => {
            if (!user)
                return
            return user.euserid
        })
}

async function getProjectManagerIdQuery(rosterId) {
    return await Roster.relatedQuery('project')
        .for(rosterId)
        .modify('notDeleted')
        .first()
        .withGraphFetched('manager(notDeleted)')
        .then(project => {
            if (!project || !project.manager) return
            return project.manager.euserid
        });
}

async function getUserPositionsQuery(permit) {
    return await UserPositionMapping.query()
        .where('eusereuserid', permit.user.euserid)
        .then(mappingList => mappingList.map(mapping => mapping.egradeegradeid));
}

function toGetSuperiorPositionPromises(userPositions) {
    return userPositions.map(positionId => {
        return Grades.relatedQuery('superior')
            .for(positionId)
            .first()
    })
}

function toGetSuperiorPositionUserListPromises(supervisorPositionIds) {
    return supervisorPositionIds.map(positionId => Grades.relatedQuery('users').for(positionId))
}

function toPermitApprovalMappingList(supervisorIds, permitId, user) {
    return supervisorIds.map(supervisorId => ({
        eusereuserid: supervisorId,
        epermitepermitid: permitId
    }))
}

permitService.requestApproval = async (permitId, user) => {

    const permit = await Permit.query()
        .findById(permitId)
        .modify('notDeleted')
        .withGraphFetched('user(notDeleted)')
        .first()

    const updatePermit = Permit.query()
        .findById(permitId)
        .updateByUserId({ epermitstatus: 1 }, user.sub)
        .returning('*')

    if (!permit || !permit.user) return
    else if (permit.user.euserid != user.sub) return

    let supervisorId

    const rosterId = await RosterUserMapping.query()
        .where('eusereuserid', user.sub)
        .first()
        .then(mapping => mapping.erostererosterid)

    if (rosterId) {
        supervisorId = await getRosterSupervisorIdQuery(rosterId)
    }

    if (!supervisorId && rosterId) {
        supervisorId = await getProjectManagerIdQuery(rosterId)
    }

    //if user is in a project
    if (supervisorId) {

        const addApprovalPermitMapping = PermitApprovalMapping.query()
            .insertToTable({eusereuserid: supervisorId, epermitepermitid: permitId}, user.sub)

        return Promise.all([addApprovalPermitMapping, updatePermit])
            .then(resultArr => resultArr[1])

    } else {

        const userPositions = await getUserPositionsQuery(permit)

        let promises = toGetSuperiorPositionPromises(userPositions)

        const supervisorPositionIds = await Promise.all(promises)
            .then(positions => positions.filter(position => position).map(position => position.egradeid))

        promises = toGetSuperiorPositionUserListPromises(supervisorPositionIds)

        const supervisorIds = await Promise.all(promises)
            .then(users => users.filter(user => user).map(user => user.euserid))

        const permitApprovalMappingList = toPermitApprovalMappingList(supervisorIds, permitId, user)

        if (permitApprovalMappingList.length > 0) {

            const insertPermitApprovalMapping = PermitApprovalMapping.query()
                .insertToTable(permitApprovalMappingList, user.sub)

            return Promise.all([insertPermitApprovalMapping, updatePermit])
                .then(resultArr => resultArr[resultArr.length - 1])

        } else {

            return Permit.query()
                .findById(permitId)
                .updateByUserId({ epermitstatus: 2 }, user.sub)
                .returning('*')
        }

    }
}

permitService.createPermit = async (permitDTO, user) => {

    permitDTO.epermitstatus = 0
    permitDTO.eusereuserid = user.sub

    const foundUser = await User.query()
        .where("euserid", permitDTO.eusereuserid)
        .modify('notDeleted')
        .first()

    if (!foundUser)
        return

    return Permit.query().insertToTable(permitDTO, user.sub)
}

permitService.updatePermitStatusById = async (permitId, status, user) => {

    let permit = await permitService.getPermitById(permitId, user)

    if (!permit) return

    const approval = await PermitApprovalMapping.query()
        .where('epermitepermitid', permitId)
        .where('eusereuserid', user.sub)
        .first()

    if (!approval) return
    else {

        const changeMappingStatusQuery = PermitApprovalMapping.query()
            .where('epermitepermitid', permitId)
            .where('eusereuserid', user.sub)
            .updateByUserId({ epermitapprovalmappingstatus: true }, user.sub)

        const deleteOtherMappingQuery = PermitApprovalMapping.query()
            .where('epermitepermitid', permitId)
            .whereNot({ eusereuserid: user.sub })
            .delete()

        const updatePermitStatus = Permit.query()
            .findById(permitId)
            .updateByUserId({ epermitstatus: status }, user.sub)
            .returning('*')

        return Promise.all([changeMappingStatusQuery, deleteOtherMappingQuery, updatePermitStatus])
            .then(resultArr => resultArr[2])
    }
}

permitService.updatePermitById = async (permitId, permitDTO, user) => {

    const permit = await permitService.getPermitById(permitId, user)

    if (!permit)
        return

    return Permit.query()
        .findById(permitId)
        .updateByUserId({
            epermitdescription: permitDTO.epermitdescription,
            epermitstartdate: permitDTO.epermitstartdate,
            epermitenddate: permitDTO.epermitenddate
        }, user.sub)
        .returning('*')
}

permitService.deletePermitById = async (permitId, user) => {

    const permit = await permitService.getPermitById(permitId, user)

    if (!permit)
        return true

    if (permit.epermitstatus > 1)
        return false

    if(permit.user.euserid != user.sub && permit.user.euserpermission <= user.permission)
        return false

    return Permit.query()
        .findById(permitId)
        .deleteByUserId(user.sub)
        .then(rowsAffected => rowsAffected === 1)

}

module.exports = permitService