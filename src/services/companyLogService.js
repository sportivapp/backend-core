const CompanyLog = require('../models/CompanyLog')
const Company = require('../models/Company')
const User = require('../models/User')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyLogRemoveEnum = require('../models/enum/companyLogRemoveEnum')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const CompanyLogTypeEnum = require('../models/enum/CompanyLogTypeEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

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

companyLogService.getListPendingByUserId = async (userId, type, sortDirection, page, size) => {

    return CompanyLog.query()
    .where('eusereuserid', userId)
    .where('ecompanylogtype', type)
    .andWhere('ecompanylogstatus', CompanyLogStatusEnum.PENDING)
    .orderBy('ecompanylogcreatetime', sortDirection)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

module.exports = companyLogService