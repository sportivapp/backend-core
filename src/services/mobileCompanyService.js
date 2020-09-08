const Company = require('../models/Company')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyLog = require('../models/CompanyLog')
const { raw } = require('objection');

const UnsupportedOperationErrorEnum = {
    USER_IN_COMPANY: 'USER_IN_COMPANY',
}

const CompanyLogTypeEnum = {
    APPLY: 'APPLY',
    INVITE: 'INVITE',
    MEMBER: 'MEMBER'
}

const CompanyLogStatusEnum = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
}

const companyService = {}

companyService.getCompany = async (companyId, user) => {

    let isInCompany = true

    const companyDetailPromise = Company.query()
    .select('efileefileid', 'ecompanyname', 'eindustryname', 'eaddressstreet', 'ecompanyphonenumber', 'ecompanyemailaddress')
    .joinRelated('address')
    .joinRelated('industry')
    .where('ecompanyid', companyId)
    .first();
    
    const departmentWithHeadPromise = Company.query()
    .select('edepartmentname', 'eusername')
    .withGraphJoined('departments.positions.users')
    .where('ecompany.ecompanyid', companyId)
    .andWhere('egradesuperiorid', null);

    const branchesPromise = Company.query()
    .select('branches.ecompanyid', 'branches.ecompanyname')
    .joinRelated('branches')
    .where('ecompany.ecompanyid', companyId);

    const userInCompany = await CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', user.sub)
    .first()

    if(!userInCompany) isInCompany = false

    const result = await Promise.all([companyDetailPromise, departmentWithHeadPromise, branchesPromise]);

    let departmentWithHead = [];
    for (let i=0; i<result[1].length; i++) {
        departmentWithHead.push({
            edepartmentname: result[1][i].edepartmentname,
            eusername: result[1][i].eusername
        })
    }

    returnedData = {
        company: result[0],
        departments: departmentWithHead,
        branches: result[2],
        isuserincompany: isInCompany
    }

    return returnedData;

}

companyService.getCompanies = async (keyword) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    return Company.query()
        .select('ecompanyid', 'ecompanyname', 'eindustryname', 'eaddressstreet', 'efileefileid')
        .joinRelated('address')
        .joinRelated('industry')
        .where('ecompanyolderid', null)
        .andWhere('ecompanyparentid', null)
        .andWhere(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
}

companyService.getVirtualMemberCard = async (companyId, user) => {

    const userInCompany = await Company.query()
        .joinRelated('users')
        .where('ecompanyid', companyId)
        .andWhere('euserid', user.sub)
        .first();

    if (!userInCompany)
        return

    const virtualMemberCard = await Company.query()
        .select('ecompany.efileefileid', 'ecompanyname', 'eusername', 'egradename')
        .withGraphJoined('users.grades')
        .where('ecompanyid', companyId)
        .andWhere('euserid', user.sub)
        .first();

    return {
        efileefileid: virtualMemberCard.efileefileid,
        ecompanyname: virtualMemberCard.ecompanyname,
        eusername: virtualMemberCard.eusername,
        egradename: virtualMemberCard.egradename
    }

}

companyService.checkUserInCompany = async (companyId, userId) => {

    await CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .andWhere('eusereuserid', userId)
    .first();

}

companyService.getPendingLog = async (companyId, userId, types) => {

    return CompanyLog.query()
    .where('eusereuserid', userId)
    .andWhere('ecompanyecompanyid', companyId)
    .whereIn('ecompanylogtype', types)
    .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
    .orderBy('ecompanylogcreatetime', 'DESC')
    .first();

}

companyService.createCompanyLog = async (companyId, user, userId, type) => {

    return CompanyLog.query().insertToTable({
        ecompanyecompanyid: companyId,
        eusereuserid: userId,
        ecompanylogtype: type
    }, user.sub);

}

companyService.updateCompanyLog = async (companyId, user, userId, status) => {

    const log = await companyService.getPendingLog(companyId, userId, [CompanyLogTypeEnum.INVITE, CompanyLogTypeEnum.APPLY]);

    return log.$query().updateByUserId({
        ecompanylogstatus: status
    }, user.sub)
    .returning('*');

}

companyService.processIntoCompany = async (companyId, user, userId) => {

    const companyUserMappingPromise = CompanyUserMapping.query().insertToTable({
        eusereuserid: userId,
        ecompanyecompanyid: companyId
    }, user.sub);

    const companyLogPromise = companyService.updateCompanyLog(companyId, user, userId, CompanyLogStatusEnum.ACCEPTED);

    return Promise.all([companyUserMappingPromise, companyLogPromise]);

}

companyService.joinCompany = async (companyId, user) => {

    // If user already in company
    const userInCompany = await companyService.checkUserInCompany(companyId, user.sub);

    if (userInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_COMPANY)

    // Check if this user already invited / applied
    const pendingInviteApply = await companyService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.INVITE, CompanyLogTypeEnum.APPLY]);

    // If there is no pending invite / apply, create apply log
    if (!pendingInviteApply)
        return companyService.createCompanyLog(companyId, user, user.sub, CompanyLogTypeEnum.APPLY);

    // If apply pending exist, return
    if (pendingInviteApply.ecompanylogtype === CompanyLogTypeEnum.APPLY && pendingInviteApply.ecompanylogstatus === CompanyLogStatusEnum.PENDING)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_APPLIED)

    // If invited, then auto join
    if (pendingInviteApply.ecompanylogtype === CompanyLogTypeEnum.INVITE && pendingInviteApply.ecompanylogstatus === CompanyLogStatusEnum.PENDING)
        return companyService.processIntoCompany(companyId, user, user.sub);

}

module.exports = companyService