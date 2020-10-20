const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyDefaultPosition = require('../models/CompanyDefaultPosition')
const UserPositionMapping = require('../models/UserPositionMapping')
const companyUserMappingService = {}

companyUserMappingService.insertUserToCompanyByCompanyLogsWithTransaction = async (companyLogs, trx, user) => {

    const defaultPosition = await CompanyDefaultPosition.query(trx)
    .where('ecompanyecompanyid', companyLogs[0].ecompanyecompanyid)
    .first()

    const companyUserMapping = companyLogs.map(companyLog => ({
        ecompanyecompanyid: companyLog.ecompanyecompanyid,
        eusereuserid: companyLog.eusereuserid,
        ecompanyusermappingpermission: 1 // not used in table, just for formalities until it removed. => TODO
    }))

    const userPositionMapping = companyLogs.map(companyLog => ({
        eusereuserid: companyLog.eusereuserid,
        egradeegradeid: defaultPosition.emembergradeid
    }))

    const insertedUsersPromise = CompanyUserMapping.query(trx)
    .insertToTable(companyUserMapping, user.sub)

    const insertedUserPositionPromise = UserPositionMapping.query(trx)
    .insertToTable(userPositionMapping, user.sub)

    return Promise.all([insertedUsersPromise, insertedUserPositionPromise])

}

module.exports = companyUserMappingService