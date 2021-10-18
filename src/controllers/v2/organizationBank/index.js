const organizationBankService = require('../../../services/v2/organizationBankService');
const ResponseHelper = require('../../../helper/ResponseHelper');

const organizationBankController = {};

organizationBankController.getAllCompanyBanks = async (req, res, next) => {

    const companyId = req.user.companyId;

    try {

        const result = await organizationBankService.getAllCompanyBanks(companyId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

organizationBankController.createCompanyBank = async (req, res, next) => {

    const companyId = req.user.companyId;
    const { masterBankId, accountName, accountNumber} = req.body;

    const companyBankDTO = {
        companyId: companyId,
        masterBankId: masterBankId,
        accountName: accountName,
        accountNumber: accountNumber,
    }

    try {

        const result = await organizationBankService.createCompanyBank(companyBankDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

organizationBankController.softDeleteCompanyBank = async (req, res, next) => {

    const { companyBankUuid } = req.params;

    try {

        const result = await organizationBankService.softDeleteCompanyBank(req.user.companyId, companyBankUuid);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

organizationBankController.updateCompanyBankToMain = async (req, res, next) => {

    const { companyBankUuid } = req.params;

    try {

        const result = await organizationBankService.updateCompanyBankToMain(req.user.companyId, companyBankUuid, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = organizationBankController;