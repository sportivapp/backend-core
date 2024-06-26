const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyDefaultPosition = require('../models/CompanyDefaultPosition')
const UserPositionMapping = require('../models/UserPositionMapping')
const CompanyLogStatusEnum = require('../models/enum/CompanyLogStatusEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    USER_NOT_INVITED: 'USER_NOT_INVITED',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    TYPE_UNACCEPTED: 'TYPE_UNACCEPTED',
    COMPANY_NOT_EXIST: 'COMPANY_NOT_EXIST',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY'
}

const mobileCompanyUserService = {}

mobileCompanyUserService.checkUserInCompany = async (userId, companyId) => {

    return CompanyUserMapping.query()
        .where('eusereuserid', userId)
        .where('ecompanyecompanyid', companyId)
        .first()
        .then(user => {
            if(!user) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)
            return true
        });

}

mobileCompanyUserService.insertUserToCompanyByCompanyLogsWithTransaction = async (companyLogs, trx, user) => {

    const companyIds = companyLogs.map(companyLog => companyLog.ecompanyecompanyid)
    
    const defaultPositions = await CompanyDefaultPosition.query()
    .whereIn('ecompanyecompanyid', companyIds)
    .then(positions => {
        if(positions.length != companyLogs.length) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.COMPANY_NOT_EXIST)
        return positions
    })

    const companyUserMappings = companyLogs.map(companyLog => ({
        ecompanyecompanyid: companyLog.ecompanyecompanyid,
        eusereuserid: companyLog.eusereuserid,
        ecompanyusermappingpermission: 1 // not used in table, just for formalities until it removed. => TODO
    }))

    const userPositionMappings = defaultPositions.map(defaultPosition => ({
        eusereuserid: user.sub, // the one who process the invitation must be the same user
        egradeegradeid: defaultPosition.emembergradeid
    }))

    const insertedUsersPromise = CompanyUserMapping.query(trx)
    .insertToTable(companyUserMappings, user.sub)

    const insertedUserPositionPromise = UserPositionMapping.query(trx)
    .insertToTable(userPositionMappings, user.sub)

    return Promise.all([insertedUsersPromise, insertedUserPositionPromise])

}

mobileCompanyUserService.getCompanyIdsByUserId = async (userId) => {

    return CompanyUserMapping.query()
        .where('eusereuserid', userId)
        .then(companyUserMappings => companyUserMappings.map(companyUserMapping => companyUserMapping.ecompanyecompanyid));

}

mobileCompanyUserService.getUserIdsByCompanyId = async (companyId) => {

    return CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .then(companyUsers => companyUsers.map(companyUser => {
            return companyUser.eusereuserid;
        }))

}

module.exports = mobileCompanyUserService