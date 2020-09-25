const License = require('../models/License')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const LicenseService = {}

LicenseService.getLicenseById = async (licenseId, userId, user) => {

    const userInCompany = CompanyUserMapping.query()
    .where('ecompanyecompanyid', user.companyId)
    .where('eusereuserid', userId)
    .first()

    if(!userInCompany)
        throw new NotFoundError()

    return License.query()
    .findById(licenseId)
    .modify('baseAttributes')
    .where('elicensecreateby', userId)
    .then(result => {
        if(!result)
            throw new NotFoundError()
        return result
    })
}

module.exports = LicenseService