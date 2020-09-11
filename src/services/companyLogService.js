const CompanyLog = require('../models/CompanyLog')
const Company = require('../models/Company')
const User = require('../models/User')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const CompanyLogTypeEnum = require('../models/enum/CompanyLogTypeEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const companyLogService = {}

companyLogService.processRequest = async (companyLogId, status, user) => {

    if (status !== CompanyLogStatusEnum.ACCEPTED && status !== CompanyLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError('STATUS_INVALID')

    const companyLog = await CompanyLog.query()
        .findById(companyLogId)

    if (!companyLog) throw new NotFoundError()

    else if (companyLog.ecompanylogtype !== CompanyLogTypeEnum.APPLY) throw new UnsupportedOperationError('TYPE_INVALID')

    if (status === CompanyLogStatusEnum.ACCEPTED)

        return CompanyLog.transaction(async trx => {

            return companyLog.$query(trx)
                .updateByUserId({ ecompanylogstatus: status }, user.sub)
                .returning('*')
                .withGraphFetched('user(baseAttributes)')
                .then(updatedCompanyLog => CompanyUserMapping.query(trx).insertToTable({
                    ecompanyecompanyid: companyLog.ecompanyecompanyid,
                    eusereuserid: companyLog.eusereuserid,
                    ecompanyusermappingpermission: 1
                    }, user.sub).then(ignored => updatedCompanyLog)
                )
        })

    else

        return companyLog.$query()
            .updateByUserId({ ecompanylogstatus: status }, user.sub)
            .returning('*')
            .withGraphFetched('user(baseAttributes)')
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

companyLogService.cancelInvite = async (companyLogId) => {

    return CompanyLog.query()
        .findById(companyLogId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = companyLogService