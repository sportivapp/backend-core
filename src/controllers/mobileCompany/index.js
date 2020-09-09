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

controller.getCompanies = async (req, res, next) => {

    const { page, size, keyword } = req.query

    try {
        const pageObj = await companyService.getCompanies(parseInt(page), parseInt(size), keyword);

        if (!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404));
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));
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

        const result = await companyService.joinCompany(companyId, req.user);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.userCancelJoin = async (req, res, next) => {

    const { companyId } = req.params

    try {

        const result = await companyService.userCancelJoin(parseInt(companyId), req.user.sub);

        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

controller.getListPendingInviteByUserId = async (req, res, next) => {

    const {page, size} = req.query

    try {

        const pageObj = await companyService.getListPendingInviteByUserId(parseInt(page), parseInt(size),req.user.sub);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));

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

controller.uploadFile = async (req, res, next) => {

    const { companyId } = req.body
    try {
        
        const result = await companyService.uploadFile(parseInt(companyId), req.file, req.user)

        return res.status(200).json(ResponseHelper.toBaseResponse(result));
        
    } catch (e) {
        next(e)
    }
}

module.exports = controller;