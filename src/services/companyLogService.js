const CompanyLog = require('../models/CompanyLog')
const Company = require('../models/Company')
const User = require('../models/User')
const CompanyLogRemoveEnum = require('../models/enum/CompanyLogRemoveEnum')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const CompanyLogTypeEnum = require('../models/enum/CompanyLogTypeEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const companyUserMappingService = require('./companyUserMappingService')

const UnsupportedOperationErrorEnum = {
    USER_NOT_INVITED: 'USER_NOT_INVITED',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    TYPE_UNACCEPTED: 'TYPE_UNACCEPTED'
}

const companyLogService = {}

companyLogService.createCompanyLog = async (companyId, user, userId, type) => {

    return CompanyLog.query().insertToTable({
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
            .update({
                ecompanylogstatus: status,
                ecompanylogchangeby: user.sub,
                ecompanylogchangetime: Date.now()
            })
            .returning('*')
            .then(async updatedCompanyLogs => {
                
                // insert user to company user mapping and set grade base on CompanyDefaultPosition
                await companyUserMappingService.insertUserToCompanyByCompanyLogsWithTransaction(companyLogs, trx, user)

                return updatedCompanyLogs

            })

        })

    } else {

        return CompanyLog.query()
            .whereIn('ecompanylogid', companyLogIds)
            .update({ 
                ecompanylogstatus: status,
                ecompanylogchangeby: user.sub,
                ecompanylogchangetime: Date.now()
            })
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

        return companyLogService.processRequest(companyLog.ecompanylogid, CompanyLogStatusEnum.ACCEPTED, loggedInUser)

    else if (companyLog.ecompanylogstatus === CompanyLogStatusEnum.REJECTED)

        return companyLog.$query().updateByUserId({
            ecompanylogtype: CompanyLogTypeEnum.INVITE,
            ecompanylogstatus: CompanyLogStatusEnum.PENDING
        }, loggedInUser.sub)
            .returning('*')
            .withGraphFetched('user(baseAttributes)')

    else

        return companyLog
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

    if(companyLogs.length !== companyLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

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


module.exports = companyLogService