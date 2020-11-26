const companyService = require('../../../services/landing/companyService')
const ResponseHelper = require('../../../helper/ResponseHelper')

const companyController = {}

companyController.getAllCompanies = async (req, res, next) => {

    const {page = '0', size = '10', keyword = '', categoryId = null} = req.query

    return companyService.getAllCompanies(parseInt(page), parseInt(size), keyword, categoryId)
        .then(pageObj => ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        .then(response => res.status(200).json(response))
        .catch(next)
}

companyController.getCompany = async (req, res, next) => {

    const {companyId} = req.params

    return companyService.getCompany(companyId, req.user)
        .then(company => ResponseHelper.toBaseResponse(company))
        .then(response => res.status(200).json(response))
        .catch(next)
}

companyController.getUsersByCompanyId = async (req, res, next) => {

    const {companyId} = req.params
    const {page = '0', size = '10', keyword = ''} = req.query

    return companyService.getUsersInCompany(parseInt(page), parseInt(size), companyId, keyword)
        .then(pageObj => ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
        .then(response => res.status(200).json(response))
        .catch(next)
}

companyController.createCompany = async (req, res, next) => {

    const user = req.user

    const {
        companyName,
        companyEmail,
        industryIds,
        companyPhoneNumber,
        countryId,
        stateId,
        street,
        isAutoNik = true
    } = req.body;

    const companyDTO = {
        ecompanyname: companyName,
        ecompanyemailaddress: companyEmail,
        ecompanyphonenumber: companyPhoneNumber,
        ecompanyautonik: isAutoNik
    }

    const addressDTO = {
        eaddressstreet: street,
        ecountryecountryid: countryId,
        estateestateid: stateId
    }

    return companyService.createCompany(companyDTO, addressDTO, industryIds, user)
        .then(company => ResponseHelper.toBaseResponse(company))
        .then(response => res.status(200).json(response))
        .catch(next)
}

module.exports = companyController