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
    COMPANY_NOT_EXIST: 'COMPANY_NOT_EXIST'
}

const mobileCompanyUserService = {}

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

module.exports = mobileCompanyUserService