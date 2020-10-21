const companyService = require('../../services/mobileCompanyService');
const ResponseHelper = require('../../helper/ResponseHelper');

const controller = {};

controller.getCompany = async (req, res, next) => {

    const { companyId } = req.params;

    try {

        const result = await companyService.getCompany(parseInt(companyId), req.user);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getAllCompanies = async (req, res, next) => {

    const { page = '0', size = '10', keyword = ''} = req.query

    try {
        const pageObj = await companyService.getAllCompanies(parseInt(page), parseInt(size), keyword);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.getMyCompanies = async (req, res, next) => {

    const { page = '0', size = '10', keyword = ''} = req.query

    try {
        const pageObj = await companyService.getMyCompanies(parseInt(page), parseInt(size), keyword, req.user);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

    } catch(e) {
        next(e);
    }

}

controller.getUsersByCompanyId = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query
    
    const { companyId } = req.params

    try {
        const pageObj = await companyService.getUsersByCompanyId(companyId, parseInt(page), parseInt(size), keyword)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

controller.getVirtualMemberCard = async (req, res, next) => {

    const { companyId } = req.params;

    try {

        const result = await companyService.getVirtualMemberCard(parseInt(companyId), req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.joinCompany = async (req, res, next) => {

    const { companyId } = req.body;
    
    try {

        const result = await companyService.joinCompany(companyId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.userCancelJoins = async (req, res, next) => {

    const { companyLogIds } = req.body

    try {

        const result = await companyService.userCancelJoins(companyLogIds, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.exitCompany = async (req, res, next) => {

    const { companyId } = req.body;
    
    try {

        const result = await companyService.exitCompany(companyId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.processInvitation = async (req, res, next) => {

    const { companyId } = req.body;
    const { status } = req.query;

    try {

        const result = await companyService.processInvitation(companyId, req.user, status.toUpperCase());

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = controller;