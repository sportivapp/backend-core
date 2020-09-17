const License = require('../models/License');
const fileService = require('./fileService');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const { query } = require('../models/License');

const LicenseService = {};

const UnsupportedLicenseErrorEnum = {
    FILE_LICENSE_NOT_EXIST : 'FILE_LICENSE_NOT_EXIST',
}

LicenseService.getLicense = async (licenseId) => {

    return License.query()
        .findById(licenseId)
        .modify('baseAttributes')
        .withGraphFetched('file(baseAttributes)')
        .withGraphFetched('licenseLevel(baseAttributesWithIndustry)')

}

LicenseService.getLicenses = async (user) => {

    return License.query()
    .modify('baseAttributes')
    .withGraphFetched('licenseLevel(baseAttributesWithIndustry)')
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
        throw new NotFoundError()

    return license.$query().updateByUserId(licenseDTO, user.sub).returning('*');

}

LicenseService.deleteLicenses = async (licenseIds, user) => {

    const licenses = await LicenseService.getLicensesByIdsAndCreateBy(licenseIds, user.sub);

    if (licenses.length === 0 || licenses.length !== licenseIds.length)
        throw new NotFoundError()

    return License.query().whereIn('elicenseid', licenseIds).del()
    .then(rowsAffected => rowsAffected === licenseIds.length);

}

module.exports = LicenseService;