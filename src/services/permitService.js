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
        .where('epermitapprovalmappingstatus', 1)

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

    if (!permit || !permit.user) return
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

function toPermitApprovalMappingList(supervisorIds, permitId) {
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
        .updateByUserId({epermitstatus: 1}, user.sub)
        .returning('*')

    if (!permit || !permit.user) return
    else if (permit.user.euserid != user.sub) return

    // let supervisorId
    //
    // const rosterId = await RosterUserMapping.query()
    //     .where('eusereuserid', user.sub)
    //     .first()
    //     .then(mapping => mapping.erostererosterid)
    //
    // if (rosterId) {
    //     supervisorId = await getRosterSupervisorIdQuery(rosterId)
    // }
    //
    // if (!supervisorId && rosterId) {
    //     supervisorId = await getProjectManagerIdQuery(rosterId)
    // }
    //
    // //if user is in a project
    // if (supervisorId) {
    //
    //     const addApprovalPermitMapping = PermitApprovalMapping.query()
    //         .insertToTable({eusereuserid: supervisorId, epermitepermitid: permitId}, user.sub)
    //
    //     return Promise.all([addApprovalPermitMapping, updatePermit])
    //         .then(resultArr => resultArr[1])
    //
    // } else {

    const approvalUserIds = await User.query().findById(permit.user.euserid)
        .withGraphFetched('[approvalUser1, approvalUser2, approvalUser3]')
        .then(foundUser => {
            let userIds = []
            if (foundUser.approvalUser1) userIds.push(foundUser.approvalUser1.euserid)
            if (foundUser.approvalUser2) userIds.push(foundUser.approvalUser2.euserid)
            if (foundUser.approvalUser3) userIds.push(foundUser.approvalUser3.euserid)
            return userIds
        })

    if (approvalUserIds.length === 0) return

    const insertPermitApprovalMapping = PermitApprovalMapping.query()
        .insertToTable(toPermitApprovalMappingList(approvalUserIds, permitId), user.sub)

    return Promise.all([insertPermitApprovalMapping, updatePermit])
        .then(resultArr => resultArr[resultArr.length - 1])

    // }
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

        await PermitApprovalMapping.query()
            .where('epermitepermitid', permitId)
            .where('eusereuserid', user.sub)
            .updateByUserId({epermitapprovalmappingstatus: status}, user.sub)

        if (permit.user.eusermultiapproval) {

            const permitStatusChangedMappings = await PermitApprovalMapping.query()
                .where('epermitepermitid', permitId)
                .whereNot({ epermitapprovalmappingstatus: 1 })

            const approvedList = permitStatusChangedMappings
                .map(mapping => mapping.epermitapprovalmappingstatus)
                .filter(status => status === 2)

            let realStatus

            if (approvedList.length === permitStatusChangedMappings.length) realStatus = 2
            else if (approvedList.length === 0) realStatus = 3

            return Permit.query()
                .findById(permitId)
                .updateByUserId({epermitstatus: realStatus}, user.sub)
                .returning('*')

        } else {

            const selectApprovedPermitMapping = await PermitApprovalMapping.query()
                .where('epermitepermitid', permitId)
                .where('epermitapprovalmappingstatus', 2)
                .first()

            let realStatus

            if (selectApprovedPermitMapping) realStatus = 2
            else realStatus = 3

            return Permit.query()
                .findById(permitId)
                .updateByUserId({epermitstatus: realStatus}, user.sub)
                .returning('*')
        }
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

    if (permit.user.euserid != user.sub && permit.user.euserpermission <= user.permission)
        return false

    return Permit.query()
        .findById(permitId)
        .deleteByUserId(user.sub)
        .then(rowsAffected => rowsAffected === 1)

}

module.exports = permitService