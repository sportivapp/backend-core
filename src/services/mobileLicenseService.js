const License = require('../models/License');
const fileService = require('./mobileFileService');

const LicenseService = {};

LicenseService.getLicense = async (licenseId) => {

    return License.query()
    .select('elicenseid', 'elicenseacademicname', 'efileefileid', 'elicensegraduationdate', 'esporttypename', 'elicenselevel', 
    'elicenseadditionalinformation')
    .leftJoinRelated('esporttype')
    .where('elicenseid', licenseId);

}

LicenseService.getLicenses = async (user) => {

    return License.query()
    .select('elicenseid', 'elicenseacademicname', 'elicensegraduationdate', 'elicenselevel', 'esporttypename')
    .joinRelated('esporttype')
    .where('elicensecreateby', user.sub);

}

LicenseService.createLicense = async (licenseDTO, user) => {

    const file = await fileService.getFileByIdAndCreateBy(licenseDTO.efileefileid, user.sub);

    if (!file)
        return

    licenseDTO.elicensegraduationdate = new Date(licenseDTO.elicensegraduationdate).getTime();

    const license = await License.query().insertToTable(licenseDTO, user.sub);

    const newPathDir = '/license/' + license.elicenseid;
    await fileService.moveFile(file, newPathDir);

    return license;

}

LicenseService.getLicensesByIdsAndCreateBy = async (licenseIds, createBy) => {

    if (!Array.isArray(licenseIds))
        licenseIds = [licenseIds]

    return License.query().whereIn('elicenseid', licenseIds).andWhere('elicensecreateby', createBy);

}

LicenseService.updateLicense = async (licenseDTO, licenseId, user) => {

    const file = await fileService.getFileByIdAndCreateBy(licenseDTO.efileefileid, user.sub);

    if (!file)
        return

    const licenses = await LicenseService.getLicensesByIdsAndCreateBy(licenseId, user.sub);
    const license = licenses[0];

    if (!license)
        return

    licenseDTO.elicensegraduationdate = new Date(licenseDTO.elicensegraduationdate).getTime();
    return license.$query().updateByUserId(licenseDTO, user.sub).returning('*');

}

LicenseService.deleteLicenses = async (licenseIds, user) => {

    const licenseIdsInteger = licenseIds.split`,`.map(x=>+x);
    const licenses = await LicenseService.getLicensesByIdsAndCreateBy(licenseIdsInteger, user.sub);

    if (licenses.length === 0 || licenses.length !== licenseIds.length)
        return

    return License.query().whereIn('elicenseid', licenseIdsInteger).del();

}

module.exports = LicenseService;