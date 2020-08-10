const companyService = require('../../services/companyService')
const ResponseHelper = require('../../helper/ResponseHelper')

const companyController = {}

function isUserNotValid(user) {
    return user.permission !== 10
}

companyController.registerCompany = async (req, res, next) => {

    const { nik, name, password, mobileNumber, companyName, companyEmail, street, postalCode } = req.body;

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
            ecompanyemailaddress: companyEmail
        }
        const addressDTO = {
            eaddressstreet: street,
            eaddresspostalcode: postalCode
        }

        const data = await companyService.registerCompany(userDTO, companyDTO, addressDTO);

        return res.status(200).json({
            data: data
        });

    } catch(e) {
        next(e);
    }
}

companyController.createCompany = async (req, res, next) => {

    if (isUserNotValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { userId } = req.query
    const user = req.user

    try {

        const { companyName, companyEmail, street, postalCode, companyParentId } = req.body;

        const companyDTO = {
            ecompanyname: companyName,
            ecompanyemailaddress: companyEmail,
            ecompanyparentid: companyParentId
        }
        const addressDTO = {
            eaddressstreet: street,
            eaddresspostalcode: postalCode
        }

        const data = await companyService.createCompany(parseInt(userId) , companyDTO, addressDTO, user);

        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch(e) {
        next(e);
    }
}

companyController.getCompany = async (req, res, next) => {

    const user = req.user

    if (isUserNotValid(user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    // type = company or type = branch
    const { page, size, type, keyword } = req.query

    try {
        const pageObj = await companyService.getCompany(parseInt(page), parseInt(size), type, keyword)
        if (!pageObj)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }

}

companyController.getUsersByCompanyId = async (req, res, next) => {

    const { page, size } = req.query

    const { companyId } = req.params

    try {
        const pageObj = await companyService.getUsersByCompanyId(companyId, parseInt(page), parseInt(size))
        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
    } catch (e) {
        next(e)
    }
}

companyController.getAllCompanyByUserId = async (req, res, next) => {

    const user = req.user

    try {
        const result = await companyService.getAllCompanyByUserId(user.sub)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

companyController.editCompany = async (req, res, next) => {

    const user = req.user

    if (isUserNotValid(user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { companyId } = req.params
    const { companyName, companyEmail, companyParentId } = req.body

    try {

        const companyDTO = {
            ecompanyname: companyName,
            ecompanyemailaddress: companyEmail,
            ecompanyparentid: companyParentId
        }

        const result = await companyService.editCompany(companyId, companyDTO, user)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

companyController.deleteCompany = async (req, res, next) => {

    const user = req.user

    if (isUserNotValid(user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { companyId } = req.params

    try {

        const companyDTO = {
            ecompanydeleteby: user.sub,
            ecompanydeletetime: Date.now(),
            ecompanydeletestatus: true
        }

        const result = await companyService.deleteCompany(companyId, companyDTO)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

companyController.saveUsersToCompany = async (req, res, next) => {

    const user = req.user

    if (isUserNotValid(user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const users = req.body.users

    users.forEach(user => {
        if (!user.id || user.deleted === undefined) return res.status(400).json(ResponseHelper.toErrorResponse(400))
    })

    const { companyId } = req.params

    try {
        const result = await companyService.saveUsersToCompany(companyId, users, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = companyController