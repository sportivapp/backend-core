const companyService = require('../../services/companyService')
const ResponseHelper = require('../../helper/ResponseHelper')

const companyController = {}

function isUserNotValid(user) {
    return user.permission !== 10
}

companyController.create = async (req, res, next) => {

    if (isUserNotValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const { nik, name, password, mobileNumber, companyName, companyEmail, street, postalCode } = req.body;
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

        const data = await companyService.createCompany(userDTO, companyDTO, addressDTO);

        return res.status(200).json({
            data: data
        });

    } catch(e) {
        next(e);
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