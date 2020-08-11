const Permit = require('../models/Permit')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const Roster = require('../models/Roster')
const RosterUserMapping = require('../models/RosterUserMapping')
const Project = require('../models/Project')

const permitService = {}

permitService.getPermitList = async (page, size, user) => {

    const permitPage = await Permit.query()
        .modify('findByUserId', user.sub)
        .modify('notDeleted')
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitPage)
}

permitService.getSubordinatePermitList = async (page, size, user) => {

    let permissionList = []

    if (user.permission === 7) {
        permissionList.push(1)
    } else {
        permissionList.push(1)
        permissionList.push(7)
    }

    const subordinateIds = await CompanyUserMapping.query()
        .select('eusereuserid')
        .where('ecompanyecompanyid', user.companyId)
        .whereIn('ecompanyusermappingpermission', permissionList)
        .modify('notDeleted')

    const getSubordinatesQuery = User.query().whereIn('euserid', subordinateIds)

    const permitPage = await User.relatedQuery('permits')
        .for(getSubordinatesQuery)
        .where('epermitstatus', 1)
        .where('ecompanyecompanyid', user.companyId)
        .modify('notDeleted')
        .withGraphFetched('user(notDeleted)')
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitPage)
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

permitService.requestApproval = async (permitId, user) => {

    const permit = await Permit.query()
        .findById(permitId)
        .modify('notDeleted')
        .withGraphFetched('user(notDeleted)')
        .first()

    if (!permit || !permit.user) return
    else if (permit.user.euserid != user.sub) return

    let supervisorId

    const rosterId = await RosterUserMapping.query()
        .select('erostererosterid')
        .where('eusereuserid', user.sub)

    if (rosterId) {
        supervisorId = Roster.relatedQuery('supervisor')
            .for(rosterId)
            .select('euserid')
    }

    if (!supervisorId) {
        const projectId = permit.eprojecteprojectid
        supervisorId = await Project.query()
            .findById(projectId)
            .modify('notDeleted')
            .withGraphFetched('manager(notDeleted)')
            .then(project => project.manager.euserid)
    }

    if (!supervisorId) {
        //implemented later when position and user relation is developed
        return
    }


     return Permit.query()
         .findById(permitId)
         .updateByUserId({ epermitstatus: 1, epermitapprovaluserid: supervisorId }, user.sub)
         .returning('*')
}

permitService.createPermit = async (permitDTO, user) => {

    permitDTO.epermitstatus = 0

    if(!permitDTO.eusereuserid) {
        if(user.permission == 8 || user.permission == 7) permitDTO.eusereuserid = user.sub
        else return
    }
    else {
        const foundUser = await User.query()
            .where("euserid", permitDTO.eusereuserid)
            .modify('notDeleted')
            .first()

        if (!foundUser)
            return

        //is permit created for staff by pm / danru or permit created for danru by pm
        if (!isDanruPermitByPM(foundUser.euserpermission, user.permission)
            && !isStaffPermitByDanruOrPM(foundUser.euserpermission, user.permission))
            return
    }

    return Permit.query().insert(permitDTO)
}

permitService.updatePermitStatusById = async (permitId, status, user) => {

    let permit = await permitService.getPermitById(permitId, user)

    if(!isStaffPermitByDanruOrPM(permit.user.euserpermission, user.permission)
        && !isDanruPermitByPM(permit.user.euserpermission, user.permission)) return
    else return Permit.query()
        .findById(permitId)
        .updateByUserId({ epermitstatus: status }, user.sub)
        .returning('*')
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

function isDanruPermitByPM(permission, superiorPermission) {

    return permission === 7 && superiorPermission === 8
}

function isStaffPermitByDanruOrPM(permission, superiorPermission) {

    return permission === 1 && (superiorPermission === 7 || superiorPermission === 8)
}

module.exports = permitService