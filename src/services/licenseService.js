const License = require('../models/License')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const LicenseService = {}

LicenseService.getLicense = async (licenseId) => {

    return License.query()
    .findById(licenseId)
    .select('elicenseid', 'elicenseacademicname', 'efileid', 'efilename', 'elicensegraduationdate', 'eindustryname', 'elicenselevel', 
    'elicenseadditionalinformation')
    .leftJoinRelated('industry')
    .joinRelated('file')
    .then(result => {
        if(!result)
            throw new NotFoundError()
        return result
    })
}

module.exports = LicenseService