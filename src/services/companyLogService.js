const CompanyLog = require('../models/CompanyLog')
const Company = require('../models/Company')
const User = require('../models/User')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const CompanyLogTypeEnum = require('../models/enum/CompanyLogTypeEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const companyLogService = {}

companyLogService.processRequest = async (companyLogId, status, user) => {

    if (!CompanyLogStatusEnum.hasOwnProperty(status)) throw new UnsupportedOperationError('STATUS_INVALID')
    else if (status !== CompanyLogStatusEnum.ACCEPTED || status !== CompanyLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError('STATUS_INVALID')

    const companyLog = await CompanyLog.query()
        .findById(companyLogId)

    if (!companyLog) throw new NotFoundError()
    else if (companyLog.ecompanylogtype !== CompanyLogTypeEnum.APPLY) throw new UnsupportedOperationError('INVALID_TYPE')

    return companyLog.$query()
        .updateByUserId({ ecompanylogstatus: status }, user.sub)
        .returning('*')
        .withGraphFetched('user')
}

companyLogService.getPendingLogList = async (page, size, companyId, type) => {

    if (!companyId) throw new UnsupportedOperationError('COMPANY_NOT_FOUND')
    if (!CompanyLogTypeEnum.hasOwnProperty(type)) throw new UnsupportedOperationError('TYPE_INVALID')

    return CompanyLog.query()
        .where('ecompanyecompanyid', companyId)
        .andWhere('ecompanylogtype', type)
        .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
        .withGraphFetched('user')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

companyLogService.inviteMember = async (companyId, email, loggedInUser) => {

    const user = await User.query().where('euseremail', email).first()

    const company = await Company.query().findById(companyId)

    if (!user || !company) throw new NotFoundError()

    return CompanyLog.query().insertToTable({
        ecompanyecompanyid: companyId,
        eusereuserid: user.euserid
    }, loggedInUser.sub)

}

companyLogService.cancelInvite = async (companyLogId) => {

    return CompanyLog.query()
        .findById(companyLogId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = companyLogService