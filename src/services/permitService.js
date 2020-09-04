const Permit = require('../models/Permit')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper')
const PermitApprovalMapping = require('../models/PermitApprovalMapping')
const PermitStatusEnum = require('../models/enum/PermitStatusEnum')
const approvalService = require('./approvalService')
const Grades = require('../models/Grades')

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
        .where('epermitapprovalmappingstatus', PermitStatusEnum.PENDING)

    const permitApprovalPage = await PermitApprovalMapping.relatedQuery('permits')
        .for(mappingSubQuery)
        .page(page, size)

    return ServiceHelper.toPageObj(page, size, permitApprovalPage)
}

permitService.getPermitById = async (permitId) => {

    const permit = await Permit.query()
        .findById(permitId)
        .modify('notDeleted')
        .withGraphFetched('user(notDeleted)')
        .first()

    if (!permit || !permit.user) return
    else return permit
}

permitService.requestApproval = async (permitId, user) => {

    const permit = await Permit.query()
        .findById(permitId)
        .modify('notDeleted')
        .withGraphFetched('user(baseAttributes).departments.parent')
        .first()

    console.log(permit)

    if (!permit || !permit.user) return

    if (permit.epermitstatus !== PermitStatusEnum.CREATED) return

    const permitUser = permit.user

    const departments = permitUser.departments.filter(department => department.ecompanyecompanyid === user.companyId)

    let valueAndTypeList = []

    valueAndTypeList.push({ type: 'USER', value: permitUser.euserid })

    if (departments > 0) {
        let isSubDepartment = false
        const departmentIds = departments.map(department => {
            if (department.parent) isSubDepartment = true
            return department.edepartmentid
        })
        valueAndTypeList.push({ type: 'DEPARTMENT LIST', value: departmentIds })
        if (isSubDepartment) {
            const parentDepartmentIds = permitUser.departments.map(department => {
                if (department.parent) return parent.edepartmentid
            })
            valueAndTypeList.push({ type: 'DEPARTMENT LIST', value: parentDepartmentIds })
        }
    }

    valueAndTypeList.push({ type: 'COMPANY', value: user.companyId })

    const approvals = await approvalService.searchApprovals(valueAndTypeList, 0)

    let insertPermitApprovalMappings

    if (approvals.length <= 0) {

        const userIds = await Grades.query()
            .where('ecompanyecompanyid', companyId)
            .orderBy('egradecreatetime', 'ASC')
            .withGraphFetched('users')
            .first()
            .then(grade => grade.users)
            .then(users => users.map(user => user.euserid))

        insertPermitApprovalMappings = PermitApprovalMapping.query()
            .insertToTable(toPermitApprovalMappingListFromUserList(userIds, permitId), user.sub)

    } else {

        insertPermitApprovalMappings = PermitApprovalMapping.query()
            .insertToTable(toPermitApprovalMappingList(approvals, permitId), user.sub)
    }

    const updatePermit = Permit.query()
        .findById(permitId)
        .updateByUserId({ epermitstatus: PermitStatusEnum.PENDING }, user.sub)
        .returning('*')

    return Promise.all([insertPermitApprovalMappings, updatePermit])
        .then(resultArr => resultArr[resultArr.length - 1])
}

permitService.createPermit = async (permitDTO, user) => {

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

    if (PermitStatusEnum.APPROVED !== status && PermitStatusEnum.REJECTED !== status) return

    let permit = await permitService.getPermitById(permitId, user)

    if (!permit) return

    const permitApproval = await PermitApprovalMapping.query()
        .where('epermitepermitid', permitId)
        .where('eusereuserid', user.sub)
        .withGraphFetched('approval')
        .first()

    if (!permitApproval) return

    else {

        await permitApproval.$query()
            .updateByUserId({ epermitapprovalmappingstatus: status }, user.sub)

        if (permitApproval.approval && permitApproval.approval.eapprovaltype === 'MULTI') {

            const permitStatusChangedMappings = await PermitApprovalMapping.query()
                .where('epermitepermitid', permitId)

            const approvedList = permitStatusChangedMappings
                .map(mapping => mapping.epermitapprovalmappingstatus)
                .filter(status => status === PermitStatusEnum.APPROVED)

            const isPendingPermitExist = permitStatusChangedMappings
                .map(mapping => mapping.epermitapprovalmappingstatus)
                .filter(status => status === PermitStatusEnum.PENDING)
                .length > 0

            const updatePermit = (status) => Permit.query()
                .findById(permitId)
                .updateByUserId({ epermitstatus: status }, user.sub)
                .returning('*')

            if (approvedList.length === permitStatusChangedMappings.length) {
                return updatePermit(PermitStatusEnum.APPROVED)
            }
            else if (!isPendingPermitExist) {
                return updatePermit(PermitStatusEnum.REJECTED)
            }
            else return permit

        } else {

            await permitApproval.$query()
                .updateByUserId({ epermitapprovalmappingstatus: status }, user.sub)

            const permitMappings = await PermitApprovalMapping.query()
                .where('epermitepermitid', permitId)

            const isApprovedExist = permitMappings
                .filter(mapping => mapping.epermitapprovalmappingstatus === PermitStatusEnum.APPROVED)
                .length > 0

            const isRejectExist = permitMappings
                .filter(mapping => mapping.epermitapprovalmappingstatus === PermitStatusEnum.REJECTED)
                .length > 0

            const updatePermit = (status) => Permit.query()
                .findById(permitId)
                .updateByUserId({ epermitstatus: status }, user.sub)
                .returning('*')

            if (isApprovedExist) return updatePermit(PermitStatusEnum.APPROVED)
            else if (isRejectExist) return updatePermit(PermitStatusEnum.REJECTED)
            else return permit
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

    if (permit.epermitstatus === PermitStatusEnum.APPROVED || permit.epermitstatus === PermitStatusEnum.REJECTED)
        return false

    if (permit.user.euserid !== user.sub)
        return false

    return permit.$query()
        .delete()
        .then(rowsAffected => rowsAffected === 1)

}

function toPermitApprovalMappingListFromUserList(userIds, permitId) {
    return userIds.map(userId => ({
        eusereuserid: userId,
        epermitepermitid: permitId
    }))
}

function toPermitApprovalMappingList(approvalList, permitId) {
    let permitApprovalMappings = []
    approvalList.forEach(approval => {
        approval.approvalUsers.forEach(approvalUser => {
            const permitApproval = {
                eapprovaleapprovalid: approval.eapprovalid,
                eusereuserid: approvalUser.eusereuserid,
                epermitepermitid: permitId
            }
            permitApprovalMappings.push(permitApproval)
        })
    })
    return permitApprovalMappings
}

module.exports = permitService