const Approval = require('../models/Approval')
const ApprovalUser = require('../models/ApprovalUser')
const User = require('../models/User')
const { transaction } = require('objection')

const approvalService = {}

approvalService.createApproval = async (approvalDTO, userIds, isMultiApproval, user) => {

    const isUserIdValid = await User.query().whereIn('euserid', userIds)
        .then(list => list.length === userIds.length)

    if (!isUserIdValid) return

    return Approval.transaction(async trx => {


        const createdApproval = await Approval.query(trx)
            .insertToTable({ ...approvalDTO, eapprovaltype: isMultiApproval ? 'MULTI' : 'SINGLE' }, user.sub)

        return addUsersFromApproval(trx, createdApproval.eapprovalid, userIds, user)
            .then(approvalUsers => ({ ...createdApproval, approvalUsers }))
    })
}

approvalService.getApproval = async (companyId, departmentId, userId) => {

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

approvalService.updateApproval = async (approvalDTO, userIds, user) => {

    const approval = await Approval.query()
        .where('ecompanyecompanyid', approvalDTO.companyId)
        .where('edepartmentedepartmentid', approvalDTO.departmentId)
        .where('etargetuserid', approvalDTO.userId)
        .first()
        .withGraphFetched('approvalUsers')

    if (!approval) return

    const actualUserIds = await User.query().whereIn('euserid', userIds)
        .then(users => users.map(user => user.euserid))

    if(actualUserIds.length !== userIds.length) return

    return Approval.transaction(async trx => {

        const updateApproval = approval.$query(trx)
            .updateByUserId({ eapprovaltype: approvalDTO.isMultiple ? 'MULTI': 'SINGLE' }, user.sub)
            .returning('*')
            .withGraphFetched('[company(baseAttributes)' +
                '.parent(baseAttributes)' +
                '.parent(baseAttributes), ' +
                'department(baseAttributes)' +
                '.parent(baseAttributes), ' +
                'users(baseAttributes)]')

        return deleteUsersFromApproval(approval.eapprovalid, actualUserIds, trx)
            .then(ignored => addUsersFromApproval(approval.eapprovalid, userIds, user, trx))
            .then(ignored => updateApproval)
    })
}

approvalService.searchApprovals = async (valueAndTypeList, index) => {
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
            if (list.length <= 0 || !isApprovalUserExist) return approvalService.searchApprovals(valueAndTypeList, index + 1)
            else return list
        })

}

async function addUsersFromApproval (approvalId, userIds, user, trx) {

    let promises = userIds
        .map(userId => ApprovalUser.query(trx).insertToTable({ eapprovaleapprovalid: approvalId, eusereuserid: userId }, user.sub))

    return Promise.all(promises)
}

async function deleteUsersFromApproval (approvalId, userIds, trx) {

    return ApprovalUser.query(trx)
        .where('eapprovaleapprovalid', approvalId)
        .whereIn('eusereuserid', userIds)
        .delete()
        .then(rowsAffected => rowsAffected > 0)
}

module.exports = approvalService