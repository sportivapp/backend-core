const License = require('../models/License');
const fileService = require('./fileService');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const { query } = require('../models/License');

const LicenseService = {};

const UnsupportedLicenseErrorEnum = {
    FILE_LICENSE_NOT_EXIST : 'FILE_LICENSE_NOT_EXIST',
    LICENSE_NOT_FOUND : 'LICENSE_NOT_FOUND'
}

LicenseService.getLicense = async (licenseId) => {

    const license = await License.query()
    .select('elicenseid', 'elicenseacademicname', 'efileid', 'efilename', 'elicensegraduationdate', 'eindustryname', 'elicenselevel', 
    'elicenseadditionalinformation')
    .leftJoinRelated('industry')
    .joinRelated('file')
    .where('elicenseid', licenseId)
    .first();

    if(!license)
        throw new NotFoundError()

    return license(query)
}

LicenseService.getLicenses = async (user) => {

    return License.query()
    .select('elicenseid', 'elicenseacademicname', 'elicensegraduationdate', 'elicenselevel', 'eindustryname')
    .joinRelated('industry')
    .where('elicensecreateby', user.sub);

}

LicenseService.createLicense = async (licenseDTO, user) => {

    const file = await fileService.getFileByIdAndCreateBy(licenseDTO.efileefileid, user.sub);

    // License must have a file attached
    if (!file)
        throw new UnsupportedOperationError(UnsupportedLicenseErrorEnum.FILE_LICENSE_NOT_EXIST)

    const license = await License.query().insertToTable(licenseDTO, user.sub);

    return license;

}

LicenseService.getLicensesByIdsAndCreateBy = async (licenseIds, createBy) => {

    return License.query().whereIn('elicenseid', licenseIds).andWhere('elicensecreateby', createBy);

}

LicenseService.updateLicense = async (licenseDTO, licenseId, user) => {

    const file = await fileService.getFileByIdAndCreateBy(licenseDTO.efileefileid, user.sub);

    // License must have a file attached
    if (!file)
         throw new UnsupportedOperationError(UnsupportedLicenseErrorEnum.FILE_LICENSE_NOT_EXIST)


    const licenses = await LicenseService.getLicensesByIdsAndCreateBy([licenseId], user.sub);
    const license = licenses[0];

    if (!license)
        throw new UnsupportedOperationError(UnsupportedLicenseErrorEnum.LICENSE_NOT_FOUND)

    return license.$query().updateByUserId(licenseDTO, user.sub).returning('*');

}

LicenseService.deleteLicenses = async (licenseIds, user) => {

    const licenses = await LicenseService.getLicensesByIdsAndCreateBy(licenseIds, user.sub);

    if (licenses.length === 0 || licenses.length !== licenseIds.length)
        throw new UnsupportedOperationError(UnsupportedLicenseErrorEnum.LICENSE_NOT_FOUND)

    return License.query().whereIn('elicenseid', licenseIds).del()
    .then(rowsAffected => rowsAffected === licenseIds.length);

}

module.exports = LicenseService;