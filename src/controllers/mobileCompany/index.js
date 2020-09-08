const companyService = require('../../services/mobileCompanyService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getCompany = async (req, res, next) => {

    const { companyId } = req.params;

    try {

        const result = await companyService.getCompany(parseInt(companyId));

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getCompanies = async (req, res, next) => {

    const { keyword } = req.query

    try {
        const result = await companyService.getCompanies(keyword);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));
    } catch(e) {
        next(e);
    }

}

controller.getVirtualMemberCard = async (req, res, next) => {

    const { companyId } = req.params;

    try {

        const result = await companyService.getVirtualMemberCard(parseInt(companyId), req.user);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.joinCompany = async (req, res, next) => {

    const { companyId } = req.body;
    
    try {

        const result = await companyService.joinTeam(companyId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;