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

        if (!data) return res.status(400).json(ResponseHelper.toErrorResponse(400))

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
            street,
            postalCode,
            companyParentId,
            companyOlderId,
            industryId,
            companyPhoneNumber,
            supervisorId,
            countryId,
            stateId,
            isAutoNik,
            companyNik,
            fileId
        } = req.body;

        const companyDTO = {
            ecompanyname: companyName,
            ecompanyemailaddress: companyEmail,
            ecompanyparentid: companyParentId,
            ecompanyolderid: companyOlderId,
            eindustryeindustryid: industryId,
            ecompanyphonenumber: companyPhoneNumber,
            ecompanyautonik: isAutoNik,
            ecompanynik: companyNik,
            efileefileid: fileId
        }

        const addressDTO = {
            eaddressstreet: street,
            eaddresspostalcode: postalCode,
            ecountryecountryid: countryId,
            estateestateid: stateId
        }

        if (companyOlderId || companyParentId) {
            if (user.functions.indexOf('C1') === -1)
                return res.status(403).json(ResponseHelper.toErrorResponse(403))
        }

        const data = await companyService.createCompany(supervisorId , companyDTO, addressDTO, user);

        if (!data) return res.status(400).json(ResponseHelper.toErrorResponse(400))

        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch(e) {
        next(e);
    }
}

companyController.getCompanyList = async (req, res, next) => {

    const user = req.user

    if (req.user.functions.indexOf('R1') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    // type = company or type = branch
    const { page, size, type, keyword, companyId } = req.query

    try {
        const pageObj = await companyService.getCompanyList(parseInt(page), parseInt(size), type, keyword, companyId, user)
        if (!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
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
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

companyController.getUsersByCompanyId = async (req, res, next) => {

    if (user.functions.indexOf('R5') === -1)
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
        street,
        postalCode,
        companyParentId,
        companyOlderId,
        industryId,
        supervisorId,
        companyPhoneNumber,
        countryId,
        stateId,
        fileId
    } = req.body

    try {

        const companyDTO = {
            ecompanyname: companyName,
            ecompanyemailaddress: companyEmail,
            ecompanyparentid: companyParentId,
            ecompanyolderid: companyOlderId,
            eindustryeindustryid: industryId,
            ecompanyphonenumber: companyPhoneNumber,
            efileefileid: fileId
        }

        const addressDTO = {
            eaddressstreet: street,
            eaddresspostalcode: postalCode,
            ecountryecountryid: countryId,
            estateestateid: stateId
        }

        const result = await companyService.editCompany(parseInt(companyId), supervisorId, companyDTO, addressDTO, user)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
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
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

companyController.saveUsersToCompany = async (req, res, next) => {

    const user = req.user

    if (user.functions.indexOf('C1') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const users = req.body.users

    users.forEach(user => {
        if (!user.id || user.deleted === undefined) return res.status(400).json(ResponseHelper.toErrorResponse(400))
    })

    const { companyId } = req.params

    try {
        const result = await companyService.saveUsersToCompany(companyId, users, user)
        if (!result) return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = companyController