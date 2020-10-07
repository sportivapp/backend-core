const Company = require('../models/Company')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyFileMapping = require('../models/CompanyFileMapping')
const Approval = require('../models/Approval')
const CompanyLog = require('../models/CompanyLog')
const User = require('../models/User')
const RosterUserMapping = require('../models/RosterUserMapping')
const ShiftRosterUserMapping = require('../models/ShiftRosterUserMapping')
const Team = require('../models/Team')
const Grade = require('../models/Grades')
const UserPositionMapping = require('../models/UserPositionMapping')
const NotificationEnum = require('../models/enum/NotificationEnum')
const CompanyLogTypeEnum = require('../models/enum/CompanyLogTypeEnum')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const { raw } = require('objection');
const ServiceHelper = require('../helper/ServiceHelper')
const notificationService = require('./notificationService')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    USER_APPLIED: 'USER_APPLIED',
    USER_IN_COMPANY: 'USER_IN_COMPANY',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    STATUS_UNACCEPTED: 'STATUS_UNACCEPTED',
    USER_NOT_INVITED: 'USER_NOT_INVITED',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED'

}

const companyService = {}

companyService.getHighestPosition = async (companyId) => {

    const users = await Grade.relatedQuery('users')
    .for(Grade.query().where('ecompanyecompanyid', companyId).andWhere('egradesuperiorid', null))
    .distinct('euserid')

    return users.map(user => user.euserid)

}

companyService.getCompany = async (companyId, user) => {

    const companyDetailPromise = Company.query()
    .withGraphFetched('[carousel, address, industry, news]')
    .where('ecompanyid', companyId)
    .first();
    
    const isInCompany = CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', user.sub)
    .first()

    const isPendingApply = companyService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.APPLY]);

    return Promise.all([companyDetailPromise, isInCompany, isPendingApply])
    .then(result => {

        return {
            ...result[0],
            isInCompany: result[1] ? true : false,
            isPendingApply: result[2] ? true : false
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

companyService.getUsersByCompanyId = async (companyId, page, size, keyword) => {

    return User.query()
    .withGraphFetched('file')
    .joinRelated('companies')
    .withGraphFetched('grades')
    .modifyGraph('grades', builder => {
        builder.where('ecompanyecompanyid', companyId)
    })
    .where('companies.ecompanyid', companyId)
    .andWhere(raw('lower("eusername")'), 'like', `%${keyword}%`)
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
        throw new NotFoundError()

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
    }, user.sub)

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

    // get company(organization) highest user position (admin)
    const getHighestPosition = await companyService.getHighestPosition(companyId)

    // If user already in company
    const userInCompany = await companyService.checkUserInCompany(companyId, user.sub);

    if (userInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_COMPANY)

    // Check if this user already invited / applied
    const pendingInviteApply = await companyService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.INVITE, CompanyLogTypeEnum.APPLY]);

    // If there is no pending invite / apply, create apply log
    if (!pendingInviteApply) {
        // after create the company log, create notification for admin
        return companyService.createCompanyLog(companyId, user, user.sub, CompanyLogTypeEnum.APPLY)
        .then(companyLog => {

            if(getHighestPosition.length > 0 ) {
                const notificationObj = {
                    enotificationbodyentityid: user.sub,
                    enotificationbodyentitytype: NotificationEnum.user.type,
                    enotificationbodyaction: NotificationEnum.user.actions.join.code,
                    enotificationbodytitle: NotificationEnum.user.actions.join.title,
                    enotificationbodymessage: NotificationEnum.user.actions.join.message
                }
    
                notificationService.saveNotification(
                    notificationObj,
                    user,
                    getHighestPosition
                )
            }
            return companyLog
        })
    }

    // If apply pending exist, return
    if (pendingInviteApply.ecompanylogtype === CompanyLogTypeEnum.APPLY && pendingInviteApply.ecompanylogstatus === CompanyLogStatusEnum.PENDING)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_APPLIED)

    // If invited, then auto join
    if (pendingInviteApply.ecompanylogtype === CompanyLogTypeEnum.INVITE && pendingInviteApply.ecompanylogstatus === CompanyLogStatusEnum.PENDING)
        return companyService.processIntoCompany(companyId, user, user.sub)
        .then(processedUser => {

            if(getHighestPosition.length > 0) {
                const notificationObj = {
                    enotificationbodyentityid: user.sub,
                    enotificationbodyentitytype: NotificationEnum.user.type,
                    enotificationbodyaction: NotificationEnum.user.actions.accepted.code,
                    enotificationbodytitle: NotificationEnum.user.actions.accepted.title,
                    enotificationbodymessage: NotificationEnum.user.actions.accepted.message
                }
    
                notificationService.saveNotification(
                    notificationObj,
                    user,
                    getHighestPosition
                )
            }
            return processedUser
        })

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
    .then(rowsAffected => rowsAffected === 1)

}

companyService.exitCompany = async (companyId, user) => {

    // If user already in Company
    const userInCompany = await companyService.checkUserInCompany(companyId, user.sub);

    if (!userInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    const getHighestPosition = await companyService.getHighestPosition(companyId)

    const removeUser = await companyService.removeUserFromCompany(userInCompany, user.sub, companyId)
    .then(ignore => {

        if(getHighestPosition.length > 0 ) {
            const notificationObj = {
                enotificationbodyentityid: user.sub,
                enotificationbodyentitytype: NotificationEnum.user.type,
                enotificationbodyaction: NotificationEnum.user.actions.exit.code,
                enotificationbodytitle: NotificationEnum.user.actions.exit.title,
                enotificationbodymessage: NotificationEnum.user.actions.exit.message
            }
    
            notificationService.saveNotification(
                notificationObj,
                user,
                getHighestPosition
            )
        } 
    })

    // delete approval user mapping
    const removeApprovalUser =  Approval.relatedQuery('approvalUsers')
        .for(Approval.query().where('ecompanyecompanyid', companyId))
        .where('eusereuserid', user.sub)
        .delete()

    // delete approval
    const removeApproval =  Approval.query()
    .where('ecompanyecompanyid', companyId)
    .andWhere('etargetuserid', user.sub)
    .delete()

    // delete user position mapping
    const removePositionUserMapping = User.relatedQuery('grades')
    .for(user.sub)
    .where('eusereuserid', user.sub)
    .delete()

    // delete user in permits
    const removePermits =  User.relatedQuery('permits')
    .for(user.sub)
    .where('eusereuserid', user.sub)
    .delete()

    // delete user in rosterusermapping
    const removeRosterUserMapping =  RosterUserMapping.query()
    .where('eusereuserid', user.sub)
    .delete()

    // delete user in shift user mapping
    const removeShiftRoster = ShiftRosterUserMapping.query()
    .where('eusereuserid', user.sub)
    .delete()

    const removeUserFromTeam = Team.relatedQuery('members')
    .for(companyId)
    .where('eusereuserid', user.sub)
    .delete()

    const removeCompanyLog = CompanyLog.query()
    .where('eusereuserid', user.sub)
    .where('ecompanyecompanyid', companyId)
    .delete()

    await Promise.all([removeApprovalUser, removeApproval, removePermits, removePositionUserMapping, removeRosterUserMapping, removeShiftRoster, removeUserFromTeam, removeCompanyLog])
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

    const getHighestPosition = await companyService.getHighestPosition(companyId)

    const pendingInvite = await companyService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.INVITE]);

    if (!pendingInvite)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    if (status === CompanyLogStatusEnum.REJECTED)
        return companyService.updateCompanyLog(companyId, user, user.sub, CompanyLogStatusEnum.REJECTED)
        .then(companyLog => {
            
            if(getHighestPosition.length > 0 ) {
                const notificationObj = {
                    enotificationbodyentityid: user.sub,
                    enotificationbodyentitytype: NotificationEnum.user.type,
                    enotificationbodyaction: NotificationEnum.user.actions.rejected.code,
                    enotificationbodytitle: NotificationEnum.user.actions.rejected.title,
                    enotificationbodymessage: NotificationEnum.user.actions.rejected.message
                }
    
                notificationService.saveNotification(
                    notificationObj,
                    user,
                    getHighestPosition
                )
            }
            return companyLog
        })

    if (status === CompanyLogStatusEnum.ACCEPTED)
        return companyService.processIntoCompany(companyId, user, user.sub)
        .then(processedUser => {

            if(getHighestPosition.length > 0 ) {
                const notificationObj = {
                    enotificationbodyentityid: user.sub,
                    enotificationbodyentitytype: NotificationEnum.user.type,
                    enotificationbodyaction: NotificationEnum.user.actions.accepted.code,
                    enotificationbodytitle: NotificationEnum.user.actions.accepted.title,
                    enotificationbodymessage: NotificationEnum.user.actions.accepted.message
                }
    
                notificationService.saveNotification(
                    notificationObj,
                    user,
                    getHighestPosition
                )
            }

            return processedUser
        })

}

module.exports = companyService