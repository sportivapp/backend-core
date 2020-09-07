const License = require('../models/License');
const fileService = require('./fileService');

const LicenseService = {};

LicenseService.getLicense = async (licenseId) => {

    return License.query()
    .select('elicenseid', 'elicenseacademicname', 'efileid', 'efilename', 'elicensegraduationdate', 'eindustryname', 'elicenselevel', 
    'elicenseadditionalinformation')
    .leftJoinRelated('industry')
    .joinRelated('file')
    .where('elicenseid', licenseId)
    .first();

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
        return

    licenseDTO.elicensegraduationdate = new Date(licenseDTO.elicensegraduationdate).getTime();

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
        return

    const licenses = await LicenseService.getLicensesByIdsAndCreateBy([licenseId], user.sub);
    const license = licenses[0];

    if (!license)
        return

    licenseDTO.elicensegraduationdate = new Date(licenseDTO.elicensegraduationdate).getTime();
    return license.$query().updateByUserId(licenseDTO, user.sub).returning('*');

}

LicenseService.deleteLicenses = async (licenseIds, user) => {

    const licenses = await LicenseService.getLicensesByIdsAndCreateBy(licenseIds, user.sub);

    if (licenses.length === 0 || licenses.length !== licenseIds.length)
        return

    return License.query().whereIn('elicenseid', licenseIds).del()
    .then(rowsAffected => rowsAffected === licenseIds.length);

}

module.exports = LicenseService;