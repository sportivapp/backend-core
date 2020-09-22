const License = require('../models/License')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const LicenseService = {}

LicenseService.getLicenseById = async (licenseId) => {

    return License.query()
    .findById(licenseId)
    .modify('baseAttributes')
    .then(result => {
        if(!result)
            throw new NotFoundError()
        return result
    })
}

module.exports = LicenseService