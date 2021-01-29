const Company = require('../models/Company')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyFileMapping = require('../models/CompanyFileMapping')
const Approval = require('../models/Approval')
const User = require('../models/User')
const RosterUserMapping = require('../models/RosterUserMapping')
const ShiftRosterUserMapping = require('../models/ShiftRosterUserMapping')
const Team = require('../models/Team')
const Grade = require('../models/Grades')
const CompanyDefaultPosition = require('../models/CompanyDefaultPosition')
const UserPositionMapping = require('../models/UserPositionMapping')
const NotificationEnum = require('../models/enum/NotificationEnum')
const CompanyLogTypeEnum = require('../models/enum/CompanyLogTypeEnum')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const CompanyLogRemoveEnum = require('../models/enum/CompanyLogRemoveEnum')
const { raw } = require('objection');
const ServiceHelper = require('../helper/ServiceHelper')
const notificationService = require('./notificationService')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const companyLogService = require('./companyLogService')
const mobileCompanyLogService = require('./mobileCompanyLogService')
const mobileCompanyUserService = require('./mobileCompanyUserService')
const CompanyLog = require('../models/CompanyLog')

const UnsupportedOperationErrorEnum = {
    USER_APPLIED: 'USER_APPLIED',
    USER_IN_COMPANY: 'USER_IN_COMPANY',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    STATUS_UNACCEPTED: 'STATUS_UNACCEPTED',
    USER_NOT_INVITED: 'USER_NOT_INVITED',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    COMPANY_NOT_EXIST: 'COMPANY_NOT_EXIST',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION'

}

const companyService = {}

// TODO: might be change to new getHighestPositionByCompanyId later
companyService.getHighestPosition = async (companyId) => {

    const adminGradeId = await CompanyDefaultPosition.query()
        .where('ecompanyecompanyid', companyId)
        .first()
        .then(defaultPosition => {
            return defaultPosition.eadmingradeid;
        });

    const users = await Grade.relatedQuery('users')
        .for(Grade.query().where('egradeid', adminGradeId))
        .distinct('euserid');

    return users.map(user => user.euserid);

}

companyService.getCompany = async (companyId, user) => {

    const isInCompany = await CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', user.sub)
    .first();

    let companyDetailPromise = Company.query()
    .where('ecompanyid', companyId)
    .modify('about')
    .first();

    const pendingLog = companyLogService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.APPLY, CompanyLogTypeEnum.INVITE]);

    return Promise.all([companyDetailPromise, pendingLog])
    .then(result => {

        return {
            ...result[0],
            pendingLog: result[1] || null,
            isInCompany: isInCompany ? true : false,
        }

    });

}

companyService.getCompanies = async (page, size, keyword, companyIds) => {

    const companyPromise = Company.query()
        .select('ecompanyid', 'ecompanyname', 'eaddressstreet', 'efileefileid')
        .joinRelated('address')
        .where('ecompanyolderid', null)
        .andWhere('ecompanyparentid', null)
        .andWhere(raw('lower("ecompanyname")'), 'like', `%${keyword.toLowerCase()}%`)
        .withGraphFetched('industries(baseAttributes)')

    // If all companies, companyIds will be undefined
    if (companyIds) {
        companyPromise.whereIn('ecompanyid', companyIds)
    }

    return companyPromise.page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

companyService.getAllCompanies = async (page, size, keyword) => {

    return companyService.getCompanies(page, size, keyword);
    
}

companyService.getMyCompanies = async (page, size, keyword, user) => {

    const companyIds = await CompanyUserMapping.query()
        .select('ecompanyecompanyid')
        .where('eusereuserid', user.sub)
        .then(companyUserMappings => companyUserMappings.map(companyUserMapping => companyUserMapping.ecompanyecompanyid));

    
        // .map(companyUserMapping => companyUserMapping.ecompanyecompanyid);

    return companyService.getCompanies(page, size, keyword, companyIds);

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

companyService.processIntoCompany = async (companyId, user, userId) => {

    const companyUserMappingPromise = CompanyUserMapping.query().insertToTable({
        eusereuserid: userId,
        ecompanyecompanyid: companyId,
        ecompanyusermappingpermission: 1
    }, user.sub);

    const companyLogPromise = companyLogService.updateCompanyLog(companyId, user, userId, CompanyLogStatusEnum.ACCEPTED);

    return Promise.all([companyUserMappingPromise, companyLogPromise]);

}

companyService.processIntoCompanyWithTransaction = async (companyId, user, userId, trx) => {

    return mobileCompanyLogService.updateCompanyLogByCompanyIdAndUserIdAndStatusWithTransaction(companyId, user, userId, CompanyLogStatusEnum.ACCEPTED, trx);

}

companyService.joinCompany = async (companyId, user) => {

    // If user already in company
    const userInCompany = await companyService.checkUserInCompany(companyId, user.sub);

    if (userInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_COMPANY)

    // Check if this user already invited / applied
    const pendingInviteApply = await mobileCompanyLogService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.INVITE, CompanyLogTypeEnum.APPLY]);

    const getAdminsInCompany = await CompanyDefaultPosition.query()
    .where('ecompanyecompanyid', companyId)
    .first()
    .then(position => {

        if(!position) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMPANY_NOT_EXIST)

        return Grade.relatedQuery('users')
        .for(Grade.query().where('egradeid', position.eadmingradeid))
        .distinct('euserid')

    })

    return CompanyLog.transaction(trx => {

    // If there is no pending invite / apply, create apply log
    if (!pendingInviteApply) {

            // after create the company log, create notification for admin
            return companyLogService.createCompanyLogWithTransaction(companyId, user, user.sub, CompanyLogTypeEnum.APPLY, trx)
            .then(async companyLog => {
    
                if(getAdminsInCompany.length > 0 ) {
        
                    const notificationObj = {
                        enotificationbodyentityid: user.sub,
                        enotificationbodyentitytype: NotificationEnum.user.type,
                        enotificationbodyaction: NotificationEnum.user.actions.join.code,
                        enotificationbodytitle: NotificationEnum.user.actions.join.title,
                        enotificationbodymessage: NotificationEnum.user.actions.join.message
                    }
            
                    await notificationService.saveNotificationWithTransaction(
                        notificationObj,
                        user,
                        getAdminsInCompany,
                        trx
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
            return companyService.processIntoCompanyWithTransaction(companyId, user, user.sub, trx)
            .then(async processedUser => {

                await mobileCompanyUserService.insertUserToCompanyByCompanyLogsWithTransaction([pendingInviteApply], trx, user);
    
                if(getAdminsInCompany.length > 0 ) {
        
                    const notificationObj = {
                        enotificationbodyentityid: user.sub,
                        enotificationbodyentitytype: NotificationEnum.user.type,
                        enotificationbodyaction: NotificationEnum.user.actions.accepted.code,
                        enotificationbodytitle: NotificationEnum.user.actions.accepted.title,
                        enotificationbodymessage: NotificationEnum.user.actions.accepted.message
                    }
            
                    await notificationService.saveNotificationWithTransaction(
                        notificationObj,
                        user,
                        getAdminsInCompany,
                        trx
                    )
                }

            return processedUser
        })
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

companyService.removeUserFromCompanyWithTransaction = async (userInCompany, userId, companyId, trx) => {

    return userInCompany.$query(trx)
    .delete()
    .where('eusereuserid', userId)
    .where('ecompanyecompanyid', companyId)
    .then(rowsAffected => rowsAffected === 1);

}

companyService.userCancelJoins = async (companyLogIds, user) => {

    const companyLogs = await mobileCompanyLogService.getPendingLogByCompanyLogIdsAndTypeOptinalUserId(companyLogIds, [CompanyLogTypeEnum.APPLY], user.sub);

    if (companyLogs.length !== companyLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    return mobileCompanyLogService.deleteCompanyLogsByLogIds(companyLogIds)

}

companyService.exitCompany = async (companyId, user) => {

    const adminObj = await Grade.query()
    .where('ecompanyecompanyid', companyId)
    .where('egradename', 'Administrator')
    .first()
    .then(adminGrade => {

        return UserPositionMapping.query()
        .where('egradeegradeid', adminGrade.egradeid)
        .then(admins => {
            const getUser = admins.filter(admin => admin.eusereuserid === user.sub)
            
            const adminObj = {
                isUserAdmin: (getUser.length > 0) ? true : false,
                adminCount: admins.length
            }

            return adminObj
        })
    })

    if(adminObj.isUserAdmin && adminObj.adminCount === 1) 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    // If user already in Company
    const userInCompany = await companyService.checkUserInCompany(companyId, user.sub);

    if (!userInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    return CompanyUserMapping.transaction(trx => {

        return companyService.removeUserFromCompanyWithTransaction(userInCompany, user.sub, companyId, trx)
        .then(async removedUser => {

            // delete approval user mapping
            const removeApprovalUser =  Approval.relatedQuery('approvalUsers', trx)
            .for(Approval.query().where('ecompanyecompanyid', companyId))
            .where('eusereuserid', user.sub)
            .delete()

            // delete approval
            const removeApproval =  Approval.query(trx)
            .where('ecompanyecompanyid', companyId)
            .andWhere('etargetuserid', user.sub)
            .delete()

            // delete user position mapping
            const removePositionUserMapping = Grade.relatedQuery('userMappings', trx)
            .for(Grade.query().where('egradename', (adminObj.isUserAdmin) ? 'Administrator' : 'Member').andWhere('ecompanyecompanyid', companyId))
            .where('eusereuserid', user.sub)
            .delete()

            // delete user in permits
            const removePermits =  User.relatedQuery('permits', trx)
            .for(user.sub)
            .where('eusereuserid', user.sub)
            .delete()

            // delete user in rosterusermapping
            const removeRosterUserMapping =  RosterUserMapping.query(trx)
            .where('eusereuserid', user.sub)
            .delete()

            // delete user in shift user mapping
            const removeShiftRoster = ShiftRosterUserMapping.query(trx)
            .where('eusereuserid', user.sub)
            .delete()

            const removeUserFromTeam = Team.relatedQuery('members', trx)
            .for(companyId)
            .where('eusereuserid', user.sub)
            .delete()

            await Promise.all([removeApprovalUser, removeApproval, removePermits, removePositionUserMapping, removeRosterUserMapping, removeShiftRoster, removeUserFromTeam])

            const getAdminsInCompany = await CompanyDefaultPosition.query(trx)
            .where('ecompanyecompanyid', companyId)
            .first()
            .then(position => {
    
                if(!position) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMPANY_NOT_EXIST)
    
                return Grade.relatedQuery('users', trx)
                .for(Grade.query().where('egradeid', position.eadmingradeid))
                .distinct('euserid')
    
            })

            if(getAdminsInCompany.length > 0 ) {
    
                const notificationObj = {
                    enotificationbodyentityid: user.sub,
                    enotificationbodyentitytype: NotificationEnum.user.type,
                    enotificationbodyaction: NotificationEnum.user.actions.exit.code,
                    enotificationbodytitle: NotificationEnum.user.actions.exit.title,
                    enotificationbodymessage: NotificationEnum.user.actions.exit.message
                }
        
                await notificationService.saveNotificationWithTransaction(
                    notificationObj,
                    user,
                    getAdminsInCompany,
                    trx
                )
            }

            const companyMemberCount = await companyService.getCompanyMemberCount(companyId);

            // If company has no member after user leaving
            if (companyMemberCount === 0) {
                await Company.query(trx)
                .where('ecompanyid', companyId)
                .delete();
            }

            return removedUser

        })
    
    })
   
}

companyService.processInvitation = async (companyLogIds, user, status) => {

    if (CompanyLogStatusEnum.ACCEPTED !== status && CompanyLogStatusEnum.REJECTED !== status)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const companyLogs = await mobileCompanyLogService.getPendingLogByCompanyLogIdsAndTypeOptinalUserId(companyLogIds, [CompanyLogTypeEnum.INVITE], user.sub);

    if (companyLogs.length !== companyLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)
    
    return CompanyLog.transaction(async trx => {

        if (CompanyLogStatusEnum.ACCEPTED === status) {

            await mobileCompanyUserService.insertUserToCompanyByCompanyLogsWithTransaction(companyLogs, trx, user);
        }

        const newCompanyLogs = await mobileCompanyLogService.updateLogsByCompanyLogsWithTransaction(companyLogs, status, user, trx)

        const companyIds = newCompanyLogs.map(newCompanyLog => newCompanyLog.ecompanyecompanyid)

        const getAdminsInCompany = await CompanyDefaultPosition.query(trx)
        .whereIn('ecompanyecompanyid', companyIds)
        .then(positions => {

            if(positions.length !== companyIds.length) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMPANY_NOT_EXIST)
            
            const adminGradeIds = positions.map(position => position.eadmingradeid)

            return Grade.relatedQuery('users')
            .for(Grade.query().whereIn('egradeid', adminGradeIds))
            .distinct('euserid')

        })

        if(getAdminsInCompany.length > 0 ) {

            let notificationObj 

            if(CompanyLogStatusEnum.ACCEPTED === status) {

                notificationObj = {                    
                    enotificationbodyentityid: user.sub,
                    enotificationbodyentitytype: NotificationEnum.user.type,
                    enotificationbodyaction: NotificationEnum.user.actions.accepted.code,
                    enotificationbodytitle: NotificationEnum.user.actions.accepted.title,
                    enotificationbodymessage: NotificationEnum.user.actions.accepted.message
                }

            } else {

                notificationObj = {                    
                    enotificationbodyentityid: user.sub,
                    enotificationbodyentitytype: NotificationEnum.user.type,
                    enotificationbodyaction: NotificationEnum.user.actions.rejected.code,
                    enotificationbodytitle: NotificationEnum.user.actions.rejected.title,
                    enotificationbodymessage: NotificationEnum.user.actions.rejected.message
                }

            }

            await notificationService.saveNotificationWithTransaction(
                notificationObj,
                user,
                getAdminsInCompany,
                trx
            )
        }


        return newCompanyLogs

    })

}

module.exports = companyService