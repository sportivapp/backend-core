const Permit = require('../models/Permit')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper')

const permitService = {}

permitService.getPermitList = async (page, size, user) => {

    const permitPage = await Permit.query()
        .where('euseruserid', user.sub)
        .modify('notDeleted')
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitPage)
}

permitService.getSubordinatePermitList = async (page, size, user) => {

    let subordinatesQuery

    if (user.permission === 7)
        subordinatesQuery = User.query().where('euserpermission', 1)

    else
        subordinatesQuery = User.query().whereIn('euserpermission', [1, 7])

    subordinatesQuery.where('euserdeletestatus', 0)

    const permitPage = await User.relatedQuery('permits')
        .for(subordinatesQuery)
        .where('epermitstatus', 1)
        .modify('notDeleted')
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitPage)
}

permitService.getPermitById = async (permitId, user) => {

    const permit = await Permit.query()
        .where('epermitid', permitId)
        .modify('notDeleted')
        .withGraphFetched('user(notDeleted)')
        .first()

    if(!permit || !permit.user) return
    else if (permit.user.euserpermission === user.permission && permit.user.euserid !== user.sub) return
    else return permit
}

permitService.requestApproval = async (permitId, user) => {

    const permit = await Permit.query()
        .where('epermitid', permitId)
        .withGraphFetched('user(notDeleted)')
        .first()

    if (!permit || !permit.user) return
    else if (permit.user.euserid != user.sub) return
    else return permit.$query().patchAndFetch({ epermitstatus: 1 })
}

permitService.createPermit = async (permitDTO, user) => {

    permitDTO.epermitstatus = 0

    if(!permitDTO.euseruserid) {
        if(user.permission == 8 || user.permission == 7) permitDTO.euseruserid = user.sub
        else return
    }
    else {
        const foundUser = await User.query()
            .where("euserid", permitDTO.euseruserid)
            .modify('notDeleted')
            .first()

        if (!foundUser)
            return

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
        .patch({ epermitstatus: status })
        .returning('*')
}

permitService.updatePermitById = async (permitId, permitDTO, user) => {

    const permit = await permitService.getPermitById(permitId, user)

    if (!permit)
        return

    return Permit.query()
        .findById(permitId)
        .patch({
            epermitdescription: permitDTO.epermitdescription,
            epermitstartdate: permitDTO.epermitstartdate,
            epermitenddate: permitDTO.epermitenddate
        })
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
        .modify('delete', user.sub)
        .then(rowsAffected => rowsAffected === 1)

}

function isDanruPermitByPM(permission, superiorPermission) {

    return permission === 7 && superiorPermission === 8
}

function isStaffPermitByDanruOrPM(permission, superiorPermission) {

    return permission === 1 && (superiorPermission === 7 || superiorPermission === 8)
}

module.exports = permitService