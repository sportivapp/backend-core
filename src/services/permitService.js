const Permit = require('../models/Permit')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper')

const permitService = {}

permitService.getPermitList = async (page, size, user) => {

    const permitPage = await Permit.query()
        .where('euseruserid', user.sub)
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitPage)
}

permitService.getSubordinatePermitList = async (page, size, user) => {

    let permissionLevel = 0

    if (user.permission === 7) permissionLevel = 1
    else if (user.permission === 8) permissionLevel = 7

    const subordinatesQuery = User.query().where('euserpermission', permissionLevel)

    const permitPage = await User.relatedQuery('permits')
        .for(subordinatesQuery)
        .where('epermitstatus', 1)
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitPage)
}

permitService.getPermitById = async (permitId, user) => {

    const result = await Permit.query()
        .select()
        .where('epermitid', permitId)
        .first()
        .withGraphFetched('user')
        .first()

    if (result && result.user.euserpermission === user.permission && result.user.euserid !== user.sub)
        return
    return result
}

permitService.requestApproval = async (permitId, user) => {

    const permit = await Permit.query()
        .select()
        .where('epermitid', permitId)
        .first()
        .withGraphFetched('user')

    if (!permit || permit.user.euserid != user.sub)
        return

    return Permit.query().patchAndFetchById(permitId, { epermitstatus: 1 })
}

permitService.createPermit = async (permitDTO, user) => {

    permitDTO.epermitstatus = 0

    if(!permitDTO.euseruserid) {
        if(user.permission == 8 || user.permission == 7) permitDTO.euseruserid = user.sub
        else return
    }
    else {
        const foundUser = await User.query().where("euserid", permitDTO.euseruserid).first()
        if (!isDanruPermitByPM(foundUser.euserpermission, user.permission)
            && !isStaffPermitByDanruAndPM(foundUser.euserpermission, user.permission))
            return
    }

    return Permit.query().insert(permitDTO)
}

permitService.updatePermitStatusById = async (permitId, status, user) => {

    let permit = await permitService.getPermitById(permitId, user)

    if (!isStaffPermitByDanru(permit.user.euserpermission, user.permission)
        && !isDanruPermitByPM(permit.user.euserpermission, user.permission))
        return

    else
        return Permit.query().patchAndFetchById(permitId, { epermitstatus: status })
}

permitService.updatePermitById = async (permitId, permitDTO, user) => {

    const permit = await permitService.getPermitById(permitId, user)

    permit.epermitdescription = permitDTO.epermitdescription
    permit.epermitstartdate = permitDTO.epermitstartdate
    permit.epermitenddate = permitDTO.epermitenddate

    return Permit.query().update(permit)

}

permitService.deletePermitById = async (permitId, user) => {

    const permit = await permitService.getPermitById(permitId, user)

    if (!permit)
        return false

    if (permit.epermitstatus > 1)
        return false

    if(permit.user.euserid != user.sub && permit.user.euserpermission <= user.permission)
        return false

    await Permit.query().deleteById(permitId)
    return true

}

function isDanruPermitByPM(permission, superiorPermission) {

    return permission === 7 && superiorPermission === 8
}

function isStaffPermitByDanru(permission, superiorPermission) {

    return permission === 1 && superiorPermission === 7
}

function isStaffPermitByDanruAndPM(permission, superiorPermission) {

    return permission === 1 && (superiorPermission === 7 || superiorPermission === 8)
}

module.exports = permitService