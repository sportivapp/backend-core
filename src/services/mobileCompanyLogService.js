const CompanyLog = require('../models/CompanyLog')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    USER_NOT_INVITED: 'USER_NOT_INVITED',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    TYPE_UNACCEPTED: 'TYPE_UNACCEPTED'
}

const mobileCompanyLogService = {}

mobileCompanyLogService.getUserCompanyPendingApplyOrCompanyInvitationByLogTypeAndUserId = async (page, size, logType, userId) => {

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

mobileCompanyLogService.getUserCompanyPendingListByLogType = async (page, size, type, user) => {

    if(type !== 'APPLY' && type !== 'INVITE') 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TYPE_UNACCEPTED)

    return mobileCompanyLogService.getUserCompanyPendingApplyOrCompanyInvitationByLogTypeAndUserId(page, size, type, user.sub)
    
}

mobileCompanyLogService.getPendingLogByCompanyLogIdsAndTypeOptinalUserId = async (companyLogIds, types, userId = null) => {

    const companyLogsPromise = CompanyLog.query()
    .whereIn('ecompanylogid', companyLogIds)
    .whereIn('ecompanylogtype', types)
    .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)

    if (userId)
        companyLogsPromise.andWhere('eusereuserid', userId);

    return companyLogsPromise
        .then(companyLogs => {
            return companyLogs
        })

}

mobileCompanyLogService.deleteCompanyLogsByLogIds = async (companyLogIds) => {

    return CompanyLog.query()
        .whereIn('ecompanylogid', companyLogIds)
        .delete()
        .then(rowsAffected => rowsAffected === companyLogIds.length);
    
}


mobileCompanyLogService.updateLogsByCompanyLogsWithTransaction = async (companyLogs, status, user, trx) => {

    const companyLogIds = companyLogs.map(companyLog => companyLog.ecompanylogid)

    return CompanyLog
    .query(trx)
    .whereIn('ecompanylogid', companyLogIds)
    .update({
        ecompanylogstatus: status,
        ecompanylogchangetime: Date.now(),
        ecompanylogchangeby: user.sub
    })
    .returning('*');

}

module.exports = mobileCompanyLogService