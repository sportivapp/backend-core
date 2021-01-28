const CompanyLog = require('../models/CompanyLog')
const Company = require('../models/Company')
const CompanyDefaultPosition = require('../models/CompanyDefaultPosition')
const User = require('../models/User')
const NotificationEnum = require('../models/enum/NotificationEnum')
const CompanyLogRemoveEnum = require('../models/enum/CompanyLogRemoveEnum')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const CompanyLogTypeEnum = require('../models/enum/CompanyLogTypeEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const companyUserMappingService = require('./companyUserMappingService')
const companyService = require('./companyService')
const notificationService = require('./notificationService')
const gradeService = require('./gradeService')
const teamService = require('./teamService')
const { raw } = require('objection')

const UnsupportedOperationErrorEnum = {
    USER_NOT_INVITED: 'USER_NOT_INVITED',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    TYPE_UNACCEPTED: 'TYPE_UNACCEPTED',
    USER_APPLIED: 'USER_APPLIED',
    USER_IN_COMPANY: 'USER_IN_COMPANY',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    STATUS_UNACCEPTED: 'STATUS_UNACCEPTED',
    COMPANY_NOT_EXIST: 'COMPANY_NOT_EXIST',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION'
}

const companyLogService = {}

companyLogService.createCompanyLog = async (companyId, user, userId, type) => {

    return CompanyLog.query().insertToTable({
        ecompanyecompanyid: companyId,
        eusereuserid: userId,
        ecompanylogtype: type
    }, user.sub)

}

companyLogService.createCompanyLogWithTransaction = async (companyId, user, userId, type, trx) => {

    return CompanyLog.query(trx).insertToTable({
        ecompanyecompanyid: companyId,
        eusereuserid: userId,
        ecompanylogtype: type
    }, user.sub)

}

companyLogService.getPendingLog = async (companyId, userId, types) => {

    return CompanyLog.query()
    .where('eusereuserid', userId)
    .andWhere('ecompanyecompanyid', companyId)
    .whereIn('ecompanylogtype', types)
    .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
    .orderBy('ecompanylogcreatetime', 'DESC')
    .first();

}

companyLogService.updateCompanyLog = async (companyId, user, userId, status) => {

    const log = await companyLogService.getPendingLog(companyId, userId, [CompanyLogTypeEnum.INVITE, CompanyLogTypeEnum.APPLY]);

    return log.$query().updateByUserId({
        ecompanylogstatus: status
    }, user.sub)
    .returning('*');

}

companyLogService.removeCompanyLog = async (userId, companyId, removeType ) => {

    if( removeType === CompanyLogRemoveEnum.USER_CANCEL_JOIN )
        return CompanyLog.query()
        .delete()
        .where('eusereuserid', userId)
        .where('ecompanyecompanyid', companyId)
        .where('ecompanylogtype', CompanyLogTypeEnum.APPLY)
        .where('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
        .first()
        .then(rowsAffected => rowsAffected === 1)

    if( removeType === CompanyLogRemoveEnum.EXIT_COMPANY )
        return CompanyLog.query()
        .where('eusereuserid', userId)
        .where('ecompanyecompanyid', companyId)
        .delete()

}

companyLogService.processRequests = async (companyLogIds, status, user) => {

    if (status !== CompanyLogStatusEnum.ACCEPTED && status !== CompanyLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError('STATUS_INVALID')

    const companyLogs = await companyLogService.getPendingLogsByCompanyLogIdsAndType(companyLogIds, [CompanyLogTypeEnum.APPLY], user)

    if(companyLogs.length !== companyLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    if (status === CompanyLogStatusEnum.ACCEPTED) {

        return CompanyLog.transaction(async trx => {

            return CompanyLog.query(trx)
            .whereIn('ecompanylogid', companyLogIds)
            .updateByUserId({
                ecompanylogstatus: status,
            },user.sub)
            .returning('*')
            .then(updatedCompanyLogs => {
                
                // insert user to company user mapping and set grade base on CompanyDefaultPosition
                return companyUserMappingService.insertUserToCompanyByCompanyLogsWithTransaction(companyLogs, trx, user)
                .then(() => updatedCompanyLogs)
            })

        })

    } else {

        return CompanyLog.query()
            .whereIn('ecompanylogid', companyLogIds)
            .updateByUserId({ 
                ecompanylogstatus: status,
            }, user.sub)
            .returning('*')
    }

}

companyLogService.getLogList = async (page, size, companyId, type, status) => {

    if (!companyId) throw new UnsupportedOperationError('COMPANY_NOT_FOUND')

    return CompanyLog.query()
        .where('ecompanyecompanyid', companyId)
        .andWhere('ecompanylogtype', type.toUpperCase())
        .andWhere('ecompanylogstatus', status.toUpperCase())
        .withGraphFetched('user(baseAttributes)')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

companyLogService.inviteMember = async (companyId, email, loggedInUser) => {

    const user = await User.query().where('euseremail', email).first()

    const company = await Company.query().findById(companyId)

    if (!user || !company) throw new NotFoundError()

    const companyLog = await CompanyLog.query()
        .where('eusereuserid', user.euserid)
        .where('ecompanyecompanyid', companyId)
        .withGraphFetched('user(baseAttributes)')
        .first()

    if (!companyLog)

        return CompanyLog.query().insertToTable({
            ecompanyecompanyid: companyId,
            eusereuserid: user.euserid,
            ecompanylogtype: CompanyLogTypeEnum.INVITE,
            ecompanylogstatus: CompanyLogStatusEnum.PENDING
        }, loggedInUser.sub)
            .withGraphFetched('user(baseAttributes)')

    else if (companyLog.ecompanylogtype === CompanyLogTypeEnum.APPLY && companyLog.ecompanylogstatus === CompanyLogStatusEnum.PENDING)

        return companyLogService.processRequests(companyLog.ecompanylogid, CompanyLogStatusEnum.ACCEPTED, loggedInUser)

    else if (companyLog.ecompanylogstatus === CompanyLogStatusEnum.REJECTED)

        return companyLog.$query()
            .updateByUserId({ ecompanylogtype: CompanyLogTypeEnum.INVITE, ecompanylogstatus: CompanyLogStatusEnum.PENDING }, loggedInUser.sub)
            .returning('*')
            .withGraphFetched('user(baseAttributes)')

    else

        return companyLog
}

companyLogService.updateCompanyLogByCompanyIdAndUserIdAndStatus = async (companyId, user, userId, status, db) => {

    const log = await companyLogService.getPendingLog(companyId, userId, [CompanyLogTypeEnum.INVITE, CompanyLogTypeEnum.APPLY]);

    return log.$query(db)
        .updateByUserId({ ecompanylogstatus: status }, user.sub)
        .returning('*');

}

companyLogService.joinCompany = async (companyId, user) => {

    const isUserInCompany = await companyService.isUserExistInCompany(companyId, user.sub);

    if (isUserInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_COMPANY)

    const existingLog = await companyLogService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.INVITE, CompanyLogTypeEnum.APPLY]);

    const adminIds = await companyService.getDefaultPositions(companyId)
        .then(position => gradeService.getUsersByPositionId(0, Number.MAX_VALUE, position.eadmingradeid))
        .then(pageObj => pageObj.data)
        .then(users => users.map(user => user.euserid))
        .catch(() => new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMPANY_NOT_EXIST))

    return CompanyLog.transaction(trx => {

        if (!existingLog) {

            return companyLogService.createCompanyLogWithTransaction(companyId, user, user.sub, CompanyLogTypeEnum.APPLY, trx)
                .then(async companyLog => {

                    if (adminIds.length > 0) {

                        const notificationObj = notificationService.buildNotificationEntity(
                            user.sub,
                            NotificationEnum.user.type,
                            NotificationEnum.user.actions.join.title,
                            NotificationEnum.user.actions.join.message,
                            NotificationEnum.user.actions.join.title
                        )

                        notificationService.saveNotificationWithTransaction(notificationObj, user, adminIds, trx)
                    }

                    return companyLog
                })
        }

        // If apply pending exist, return
        if (existingLog.ecompanylogtype === CompanyLogTypeEnum.APPLY && existingLog.ecompanylogstatus === CompanyLogStatusEnum.PENDING)
            throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_APPLIED)


        // If invited, then auto join
        if (existingLog.ecompanylogtype === CompanyLogTypeEnum.INVITE && existingLog.ecompanylogstatus === CompanyLogStatusEnum.PENDING)

            return companyLogService.updateCompanyLogByCompanyIdAndUserIdAndStatus(companyId, user, user.sub, CompanyLogStatusEnum.ACCEPTED, trx)
                .then(async processedUser => {

                    await companyUserMappingService.insertUserToCompanyByCompanyLogsWithTransaction([existingLog], trx, user);

                    if(adminIds.length > 0 ) {

                        const notificationObj = notificationService.buildNotificationEntity(
                            user.sub,
                            NotificationEnum.user.type,
                            NotificationEnum.user.actions.accepted.title,
                            NotificationEnum.user.actions.accepted.message,
                            NotificationEnum.user.actions.accepted.title
                        )

                        notificationService.saveNotificationWithTransaction(notificationObj, user, adminIds, trx)
                    }

                    return processedUser
                })
    })

}

companyLogService.getPendingLogsByCompanyLogIdsAndType = async (companyLogIds, types, user) => {

    return CompanyLog.query()
    .whereIn('ecompanylogid', companyLogIds)
    .whereIn('ecompanylogtype', types)
    .where('ecompanyecompanyid', user.companyId)
    .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)

}

companyLogService.cancelInvites = async (companyLogIds, user) => {

    const companyLogs = await companyLogService.getPendingLogsByCompanyLogIdsAndType(companyLogIds, [CompanyLogTypeEnum.INVITE], user)

    if(companyLogs.length !== companyLogIds.length) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    return CompanyLog.query()
        .whereIn('ecompanylogid', companyLogIds)
        .delete()
        .then(rowsAffected => rowsAffected === companyLogIds.length)
}

companyLogService.getListPendingByUserId = async (userId, type, sortDirection, page, size) => {

    return CompanyLog.query()
    .where('eusereuserid', userId)
    .where('ecompanylogtype', type)
    .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
    .orderBy('ecompanylogcreatetime', sortDirection)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}


companyLogService.getListPendingByTypesAndUserId = async (userId, types) => {

    return CompanyLog.query()
        .where('eusereuserid', userId)
        .whereIn('ecompanylogtype', types)
        .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
}


companyLogService.getCompanyListLogByUserId = async (userId, type, page, size, keyword, categoryId) => {

    let query = CompanyLog.query()

    if (categoryId)
        query = query
            .withGraphJoined('company(baseAttributes).[logo(baseAttributes), industries(baseAttributes)]')
            .where('company:industries.eindustryid', categoryId)
    else
        query = query
            .withGraphJoined('company(baseAttributes).logo(baseAttributes)')

    return query
        .where('eusereuserid', userId)
        .where('ecompanylogtype', type)
        .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
        .andWhere(raw('lower(company.ecompanyname)'), 'like', `%${keyword.toLowerCase()}%`)
        .modify('list')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

companyLogService.getUserCompanyPendingApplyOrCompanyInvitationByLogTypeAndUserId = async (page, size, logType, userId) => {

    return CompanyLog.query()
    .modify('baseAttributes')
    .select('ecompanylogcreatetime')
    .where('eusereuserid', userId)
    .where('ecompanylogtype', logType)
    .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
    .withGraphFetched('company(baseAttributes).industry(baseAttributes)')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

companyLogService.getUserCompanyPendingListByLogType = async (page, size, type, user) => {

    if(type !== 'APPLY' && type !== 'INVITE') 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TYPE_UNACCEPTED)

    return companyLogService.getUserCompanyPendingApplyOrCompanyInvitationByLogTypeAndUserId(page, size, type, user.sub)
    
}

companyLogService.getLogCountByTypeAndUser = async (type, user) => {

    return CompanyLog.query()
        .where('ecompanylogtype', type)
        .where('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
        .where('eusereuserid', user.sub)
        .count()
        .first()
}

companyLogService.getPendingLogByCompanyLogIdsAndTypeOptinalUserId = async (companyLogIds, types, userId = null) => {

    const companyLogsPromise = CompanyLog.query()
        .whereIn('ecompanylogid', companyLogIds)
        .whereIn('ecompanylogtype', types)
        .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)

    if (userId)
        companyLogsPromise.andWhere('eusereuserid', userId);

    return companyLogsPromise

}

companyLogService.userCancelJoins = async (companyLogIds, user) => {

    const companyLogs = await companyLogService.getPendingLogByCompanyLogIdsAndTypeOptinalUserId(companyLogIds, [CompanyLogTypeEnum.APPLY], user.sub);

    if (companyLogs.length !== companyLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    return companyLogService.deleteCompanyLogsByLogIds(companyLogIds)

}

companyLogService.deleteCompanyLogsByLogIds = async (companyLogIds) => {

    return CompanyLog.query()
        .whereIn('ecompanylogid', companyLogIds)
        .delete()
        .then(rowsAffected => rowsAffected === companyLogIds.length);

}

companyLogService.exitCompany = async (companyId, user) => {

    const getAdminIdsQuery = companyService.getDefaultPositions(companyId)
        .then(position => gradeService.getUsersByPositionId(0, Number.MAX_VALUE, position.eadmingradeid))
        .then(pageObj => pageObj.data)
        .then(users => users.map(user => user.euserid))
        .catch(() => new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMPANY_NOT_EXIST))

    const adminUserIds = await getAdminIdsQuery

    if (adminUserIds.length === 1 && adminUserIds.indexOf(user.sub) !== -1)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    // If user already in Company
    const userInCompany = await companyService.isUserExistInCompany(companyId, user.sub);

    if (!userInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    return CompanyLog.transaction(async trx => {

        const removedUser = await companyUserMappingService.deleteByUserIdAndCompanyId(user.sub, companyId, trx)

        const removeUserPositionMapping = gradeService.getAllGradesByUserIdAndCompanyId(companyId, user.sub)
            .then(grades => grades.map(grade => grade.egradeid))
            .then(gradeIds => gradeService.deleteUserPositionMappingByGradeIdsAndUserId(gradeIds, user.sub, trx))

        const removeUserFromTeam = teamService.removeUserFromOwnTeams(user, trx)

        await Promise.all([removeUserPositionMapping, removeUserFromTeam])

        const isCompanyDeleted = await companyService.getMemberCount(companyId)
            .then(count => {
                if (count === 0) return companyService.deleteCompanyWithDbObject(companyId, trx)
            })

        if (!isCompanyDeleted) {

            const adminIds = await getAdminIdsQuery

            if(adminIds.length > 0 ) {

                const notificationObj = {
                    enotificationbodyentityid: user.sub,
                    enotificationbodyentitytype: NotificationEnum.user.type,
                    enotificationbodyaction: NotificationEnum.user.actions.exit.code,
                    enotificationbodytitle: NotificationEnum.user.actions.exit.title,
                    enotificationbodymessage: NotificationEnum.user.actions.exit.message
                }

                notificationService.saveNotification(notificationObj, user, adminIds)
            }
        }
        return removedUser

    })

}

companyLogService.processInvitation = async (companyLogIds, user, status) => {

    if (CompanyLogStatusEnum.ACCEPTED !== status && CompanyLogStatusEnum.REJECTED !== status)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const companyLogs = await companyLogService.getPendingLogByCompanyLogIdsAndTypeOptinalUserId(companyLogIds, [CompanyLogTypeEnum.INVITE], user.sub);

    if (companyLogs.length !== companyLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    return CompanyLog.transaction(async trx => {

        if (CompanyLogStatusEnum.ACCEPTED === status) {

            await companyUserMappingService.insertUserToCompanyByCompanyLogsWithTransaction(companyLogs, trx, user);
        }

        const newCompanyLogs = await companyLogService.updateLogsByCompanyLogsWithTransaction(companyLogs, status, user, trx)

        const companyIds = newCompanyLogs.map(newCompanyLog => newCompanyLog.ecompanyecompanyid)

        const getAdminsInCompany = await CompanyDefaultPosition.query(trx)
            .whereIn('ecompanyecompanyid', companyIds)
            .then(positions => {

                if(positions.length !== companyIds.length) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMPANY_NOT_EXIST)

                let adminIds = []

                const adminGradeIds = positions.map(position => position.eadmingradeid)
                    .map(gradeId => gradeService.getUsersByPositionId(0, Number.MAX_VALUE, gradeId)
                        .then(pageObj => pageObj.data)
                        .then(users => users.map(user => user.euserid)))

                return Promise.all(adminGradeIds)
                    .then(results => {
                        results.forEach(userIds => adminIds.concat(userIds))
                        return adminIds
                    })
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

            notificationService.saveNotificationWithTransaction(notificationObj, user, getAdminsInCompany, trx)
        }


        return newCompanyLogs

    })

}

module.exports = companyLogService