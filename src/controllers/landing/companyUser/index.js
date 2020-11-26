const companyUserService = require('../../../services/landing/companyUserService')
const ResponseHelper = require('../../../helper/ResponseHelper')

const companyUserController = {}

companyUserController.getUserCompanySummary = async (req, res, next) => {

    return companyUserService.getUserCompanyListSummary(req.user)
        .then(data => ResponseHelper.toBaseResponse(data))
        .then(responseBody => res.status(200).json(responseBody))
        .catch(next)
}

companyUserController.getMyCompanies = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query

    return companyUserService.getMyCompanies(parseInt(page), parseInt(size), keyword, req.user)
        .then(pageObj => ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        .then(response => res.status(200).json(response))
        .catch(next)
}

companyUserController.exitCompany = async (req, res, next) => {

    const { companyId } = req.params;

    return companyUserService.exitCompany(companyId, req.user)
        .then(result => ResponseHelper.toBaseResponse(result))
        .then(response => res.status(200).json(response))
        .catch(next);
}

companyUserController.getRequestedCompanies = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query

    return companyUserService.getRequestedCompanies(parseInt(page), parseInt(size), keyword, req.user)
        .then(pageObj => ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        .then(response => res.status(200).json(response))
        .catch(next)
}

companyUserController.getCompanyInvites = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query

    return companyUserService.getCompanyInvites(parseInt(page), parseInt(size), keyword, req.user)
        .then(pageObj => ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        .then(response => res.status(200).json(response))
        .catch(next)
}

module.exports = companyUserController