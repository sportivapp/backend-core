const companyService = require('../../services/companyService')
const ResponseHelper = require('../../helper/ResponseHelper')

const companyController = {}

companyController.registerCompany = async (req, res, next) => {

    const { nik, name, password, mobileNumber, companyName, companyEmail, street, postalCode, industryId, countryId, stateId } = req.body;

    try {

        const userDTO = {
            eusernik: nik,
            eusername: name,
            euseremail: companyEmail,
            euserpassword: password,
            eusermobilenumber: mobileNumber
        }
        const companyDTO = {
            ecompanyname: companyName,
            ecompanyemailaddress: companyEmail,
            ecompanyphonenumber: mobileNumber,
            eindustryeindustryid: industryId
        }
        const addressDTO = {
            eaddressstreet: street,
            eaddresspostalcode: postalCode,
            ecountryecountryid: countryId,
            estateestateid: stateId
        }

        const data = await companyService.registerCompany(userDTO, companyDTO, addressDTO);
        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch(e) {
        next(e);
    }
}

companyController.createCompany = async (req, res, next) => {

    const user = req.user

    try {

        const {
            companyName,
            companyEmail,
            companyParentId,
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
            ecompanyautonik: isAutoNik,
            ecompanyparentid: companyParentId
        }

        const addressDTO = {
            eaddressstreet: street,
            ecountryecountryid: countryId,
            estateestateid: stateId
        }

        if (companyParentId) {
            if (user.functions.indexOf('C1') === -1)
                return res.status(403).json(ResponseHelper.toErrorResponse(403))
        }

        const data = await companyService.createCompany(companyDTO, addressDTO, industryIds, user);
        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch(e) {
        next(e);
    }
}

companyController.getAllCompanyList = async (req, res, next) => {

    const user = req.user

    // type = company or type = branch
    const { page = '0', size = '10', type, keyword = '', companyId } = req.query

    try {
        const pageObj = await companyService.getAllCompanyList(parseInt(page), parseInt(size), type, keyword.toLowerCase(),
            parseInt(companyId), user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

companyController.getMyCompanyList = async (req, res, next) => {

    const { page = '0', size = '10', keyword = '' } = req.query

    try {
        const pageObj = await companyService.getMyCompanyList(parseInt(page), parseInt(size), keyword.toLowerCase(), req.user)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

companyController.getCompanyById = async (req, res, next) => {

    const user = req.user

    if (user.functions.indexOf('R1') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { companyId } = req.params

    try {
        const result = await companyService.getCompleteCompanyById(companyId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

companyController.getUsersByCompanyId = async (req, res, next) => {

    if (req.user.functions.indexOf('R5') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { page = '0', size = '10', keyword = '' } = req.query

    const { companyId } = req.params

    try {
        const pageObj = await companyService.getUsersByCompanyId(companyId, parseInt(page), parseInt(size), keyword)
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

companyController.editCompany = async (req, res, next) => {

    const user = req.user

    if (req.user.functions.indexOf('U1') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { companyId } = req.params

    const { companyName,
        companyEmail,
        companyParentId,
        industryIds,
        companyPhoneNumber,
        countryId,
        stateId,
        street,
        fileId
    } = req.body

    try {

        const companyDTO = {
            ecompanyname: companyName,
            ecompanyemailaddress: companyEmail,
            ecompanyparentid: companyParentId,
            ecompanyphonenumber: companyPhoneNumber,
            efileefileid: fileId
        }

        const addressDTO = {
            eaddressstreet: street,
            ecountryecountryid: countryId,
            estateestateid: stateId
        }

        const result = await companyService.editCompany(parseInt(companyId), companyDTO, addressDTO, industryIds, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

companyController.deleteCompany = async (req, res, next) => {

    const user = req.user

    if (user.functions.indexOf('D1') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { companyId } = req.params

    try {

        const result = await companyService.deleteCompany(companyId)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

companyController.saveUsersToCompany = async (req, res, next) => {

    const user = req.user

    if (user.functions.indexOf('C1') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { users } = req.body

    const { companyId } = req.params

    try {
        const result = await companyService.saveUsersToCompany(parseInt(companyId), users, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = companyController