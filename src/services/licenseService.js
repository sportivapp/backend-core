const License = require('../models/License')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const LicenseService = {}

LicenseService.getLicenseById = async (licenseId, userId, companyId) => {

    const userInCompany = CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', userId)
    .first()

    if(!userInCompany)
        throw new NotFoundError()

    return License.query()
    .findById(licenseId)
    .where('elicensecreateby', userId)
    .modify('baseAttributes')
    .then(result => {
        if(!result)
            throw new NotFoundError()
        return result
    })
}

module.exports = LicenseService