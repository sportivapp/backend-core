const licenseService = require('../../services/mobileLicenseService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getLicense = async (req, res, next) => {

    const { licenseId } = req.params;

    try {

        const result = await licenseService.getLicense(parseInt(licenseId));

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getLicenses = async (req, res, next) => {

    try {
        const result = await licenseService.getLicenses(req.user);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.createLicense = async (req, res, next) => {

    const { academicName, graduationDate, industryId, level, additionalInformation, fileId } = req.body;

    const licenseDTO = {
        elicenseacademicname: academicName,
        elicensegraduationdate: graduationDate,
        eindustryeindustryid: industryId,
        elicenselevel: level,
        elicenseadditionalinformation: additionalInformation,
        efileefileid: fileId
    }

    try {
        const result = await licenseService.createLicense(licenseDTO, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.updateLicense = async (req, res, next) => {

    const { academicName, graduationDate, industryId, level, additionalInformation, fileId } = req.body;
    const { licenseId } = req.params;

    const licenseDTO = {
        elicenseacademicname: academicName,
        elicensegraduationdate: graduationDate,
        eindustryeindustryid: industryId,
        elicenselevel: level,
        elicenseadditionalinformation: additionalInformation,
        efileefileid: fileId
    }

    try {

        const result = await licenseService.updateLicense(licenseDTO, parseInt(licenseId), req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.deleteLicenses = async (req, res, next) => {

    const { licenseIds } = req.body;

    try {

        const result = await licenseService.deleteLicenses(licenseIds, req.user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

module.exports = controller;