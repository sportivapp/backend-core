const Approval = require('../models/Approval')
const ApprovalUser = require('../models/ApprovalUser')
const User = require('../models/User')
const Company = require('../models/Company')
const Department = require('../models/Department')

const service = {}

service.createApproval = async (approvalDTO, userIds, isMultiApproval, user) => {

    const isUserIdValid = await User.query().whereIn('euserid', userIds)
        .then(list => list.length === userIds.length)

    if (!isUserIdValid) return

    return Approval.query()
        .insertToTable({ ...approvalDTO, eapprovaltype: isMultiApproval ? 'MULTI' : 'SINGLE' }, user.sub)
        .then(approval => [approval, userIds.map(userId => ({eapprovaleapprovalid: approval.eapprovalid, eusereuserid: userId}))])
        .then(resultArr => ApprovalUser.query().insertToTable(resultArr[1], user.sub)
            .then(approvalUsers => ({ ...resultArr[0], approvalUsers })))
}

service.getApproval = async (companyId, departmentId, userId) => {

    if (!companyId) return

    if (!departmentId) departmentId = null

    if (!userId) userId = null

    return Approval.query()
        .where('ecompanyecompanyid', companyId)
        .where('edepartmentedepartmentid', departmentId)
        .where('etargetuserid', userId)
        .withGraphFetched('[company(baseAttributes)' +
            '.parent(baseAttributes)' +
            '.parent(baseAttributes), ' +
            'department(baseAttributes)' +
            '.parent(baseAttributes), ' +
            'users(baseAttributes)]')
        .first()
}

service.updateApproval = async (companyId = null, departmentId = null, userId = null, isMultiple, user) => {

    return Approval.query()
        .where('ecompanyecompanyid', companyId)
        .where('edepartmentedepartmentid', departmentId)
        .where('etargetuserid', userId)
        .first()
        .updateByUserId({ eapprovaltype: isMultiple ? 'MULTI': 'SINGLE' }, user.sub)
        .returning('*')
        .withGraphFetched('[company(baseAttributes)' +
            '.parent(baseAttributes)' +
            '.parent(baseAttributes), ' +
            'department(baseAttributes)' +
            '.parent(baseAttributes), ' +
            'users(baseAttributes)]')
}

service.addUserFromApproval = async (approvalId, userId) => {

    const user = await User.query().findById(userId)

    if (!user) return

    const approval = await Approval.query().findById(approvalId)

    if (!approval) return

    return ApprovalUser.query().insertToTable({ eapprovaleapprovalid: approvalId, eusereuserid: userId }, user.sub)
}

service.deleteUserFromApproval = async (approvalId, userId) => {

    const user = await User.query().findById(userId)

    if (!user) return false

    const approval = await Approval.query().findById(approvalId)

    if (!approval) return false

    return ApprovalUser.query()
        .where('eapprovaleapprovalid', approvalId)
        .where('eusereuserid', userId )
        .delete()
        .then(rowsAffected => rowsAffected > 0)
}

service.searchApprovals = async (valueAndTypeList, index) => {
    if (index >= valueAndTypeList.length) return []
    let type = valueAndTypeList[index].type
    let value = valueAndTypeList[index].value
    let column
    if (type.includes('DEPARTMENT')) column = 'edepartmentedepartmentid'
    else if (type.includes('USER')) column = 'etargetuserid'
    else column = 'ecompanyecompanyid'
    let query = Approval.query()
    query = type.includes('LIST') ? query.whereIn(column, value) : query.where(column, value)
    return query
        .withGraphFetched('approvalUsers')
        .then(list => {
            const isApprovalUserExist = list.map(approval => approval.approvalUsers.length)
                .filter(length => length > 0).length > 0
            if (list.length <= 0 || !isApprovalUserExist) return service.searchApprovals(valueAndTypeList, index + 1)
            else return list
        })

}

module.exports = service