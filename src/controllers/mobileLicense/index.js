const licenseService = require('../../services/mobileLicenseService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getLicense = async (req, res, next) => {

    const { licenseId } = req.params;

    try {

        const result = await licenseService.getLicense(parseInt(licenseId));

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getLicenses = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query;

    try {
        const pageObj = await licenseService.getLicenses(req.user, parseInt(page), parseInt(size), keyword);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));
    } catch(e) {
        next(e);
    }

}

controller.createLicense = async (req, res, next) => {

    const { academicName, graduationDate, industryId, licenseLevelId, additionalInformation, fileId } = req.body;

    const licenseDTO = {
        elicenseacademicname: academicName,
        elicensegraduationdate: graduationDate,
        eindustryeindustryid: industryId,
        elicenselevelelicenselevelid: licenseLevelId,
        elicenseadditionalinformation: additionalInformation,
        efileefileid: fileId
    }

    try {
        const result = await licenseService.createLicense(licenseDTO, req.user);
        
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.updateLicense = async (req, res, next) => {

    const { academicName, graduationDate, industryId, licenseLevelId, additionalInformation, fileId } = req.body;
    const { licenseId } = req.params;

    const licenseDTO = {
        elicenseacademicname: academicName,
        elicensegraduationdate: graduationDate,
        eindustryeindustryid: industryId,
        elicenselevelelicenselevelid: licenseLevelId,
        elicenseadditionalinformation: additionalInformation,
        efileefileid: fileId
    }

    try {

        const result = await licenseService.updateLicense(licenseDTO, parseInt(licenseId), req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.deleteLicenses = async (req, res, next) => {

    const { licenseIds } = req.body;

    try {

        const result = await licenseService.deleteLicenses(licenseIds, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

module.exports = controller;