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

module.exports = mobileCompanyLogService