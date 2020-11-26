const CompanyUserMapping = require('../models/CompanyUserMapping')
const CompanyDefaultPosition = require('../models/CompanyDefaultPosition')
const UserPositionMapping = require('../models/UserPositionMapping')
const companyUserMappingService = {}

const ErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY'
}

companyUserMappingService.insertUserToCompanyByCompanyLogsWithTransaction = async (companyLogs, trx, user) => {

    const defaultPosition = await CompanyDefaultPosition.query(trx)
    .where('ecompanyecompanyid', user.companyId)
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

companyUserMappingService.checkCompanyUserByCompanyIdAndUserId = async (companyId, userId) => {

    return CompanyUserMapping.query()
        .where('ecompanyecompanyid', companyId)
        .where('eusereuserid', userId)
        .first()
        .then(member => {
            if (!member)
                return false;
            return true;
        });

}

companyUserMappingService.deleteByUserIdAndCompanyId = async (userId, companyId, db) => {

    return CompanyUserMapping.query(db)
        .where('eusereuserid', userId)
        .where('ecompanyecompanyid', companyId)
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = companyUserMappingService