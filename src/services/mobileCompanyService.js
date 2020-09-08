const Company = require('../models/Company')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyLog = require('../models/CompanyLog')
const User = require('../models/User')
const { raw } = require('objection');
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    USER_IN_COMPANY: 'USER_IN_COMPANY',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    STATUS_UNACCEPTED: 'STATUS_UNACCEPTED',
    USER_NOT_INVITED: 'USER_NOT_INVITED'

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

    const userInCompany = CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', user.sub)
    .first()

    const isPendingApply = companyService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.APPLY])

    return Promise.all([companyDetailPromise, departmentWithHeadPromise, branchesPromise, userInCompany, isPendingApply])
    .then(arr => {
        let departmentWithHead = [];

        for (let i=0; i < arr[1].length; i++) {
            departmentWithHead.push({
                edepartmentname: arr[1][i].edepartmentname,
                eusername: arr[1][i].eusername
            })
        }

        return {
            company: arr[0],
            departments: departmentWithHead,
            branches: arr[2],
            isuserincompany: (arr[3]) ? true : false,
            isapply: (arr[4]) ? true : false
        }

    })

}

companyService.getCompanies = async (page, size, keyword) => {

    if(isNaN(page) || isNaN(size)) {
        page = 0
        size = 10
    }

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    return Company.query()
        .select('ecompanyid', 'ecompanyname', 'eindustryname', 'eaddressstreet', 'efileefileid')
        .joinRelated('address')
        .joinRelated('industry')
        .where('ecompanyolderid', null)
        .andWhere('ecompanyparentid', null)
        .andWhere(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
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

    return CompanyUserMapping.query()
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
        ecompanyecompanyid: companyId,
        ecompanyusermappingpermission: 1
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

companyService.getListPendingInviteByUserId = async (page, size, userId) => {

    if(isNaN(page) || isNaN(size)) {
        page = 0
        size = 10
    }

    const userFromDB = User.query()
        .select()
        .where('euserid', userId)
        .first()
    
    if(!userFromDB)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    return CompanyLog.query()
    .where('eusereuserid', userId)
    .where('ecompanylogtype', CompanyLogTypeEnum.INVITE)
    .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
    .orderBy('ecompanylogcreatetime', 'DESC')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

companyService.getCompanyMemberCount = async (companyId) => {

    const companyMemberCount = await CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .count()
    .first();

    return parseInt(companyMemberCount.count);
    
}

companyService.removeUserFromCompany = async (userInCompany, userId, companyId) => {

    return userInCompany.$query()
    .delete()
    .where('eusereuserid', userId)
    .where('ecompanyecompanyid', companyId)
    .then(rowsAffected => rowsAffected === 1);

}


companyService.userCancelJoin = async (companyId, userId) => {
    const userFromDB = User.query()
    .select()
    .where('euserid', userId)
    .first()

    if(!userFromDB)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    return CompanyLog.query()
    .delete()
    .where('eusereuserid', userId)
    .where('ecompanyecompanyid', companyId)
    .where('ecompanylogtype', CompanyLogTypeEnum.APPLY)
    .where('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
    .first()

}

companyService.exitCompany = async (companyId, user) => {

    // If user already in Company
    const userInCompany = await companyService.checkUserInCompany(companyId, user.sub);

    if (!userInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    const removeUser = await companyService.removeUserFromCompany(userInCompany, user.sub, companyId);

    const companyMemberCount = await companyService.getCompanyMemberCount(companyId);

    // If company has no member after user leaving
    if (companyMemberCount === 0) {
        await Company.query()
        .where('ecompanyid', companyId)
        .delete();
    }

    return removeUser

}

companyService.processInvitation = async (companyId, user, status) => {

    if (status !== CompanyLogStatusEnum.ACCEPTED && status !== CompanyLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const pendingInvite = await companyService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.INVITE]);

    if (!pendingInvite)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    if (status === CompanyLogStatusEnum.REJECTED)
        return companyService.updateCompanyLog(companyId, user, user.sub, CompanyLogStatusEnum.REJECTED)

    if (status === CompanyLogStatusEnum.ACCEPTED)
        return companyService.processIntoCompany(companyId, user, user.sub);

}

module.exports = companyService