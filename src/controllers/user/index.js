const userService = require('../../services/userService')
const ResponseHelper = require('../../helper/ResponseHelper')
const templatePath = require('../../../templates/index');

const userController = {}

function isUserNotValid(user) {
    return user.permission !== 9 && user.permission !== 10
}

userController.changePassword = async (req, res, next) => {

    const user = req.user;
    const { newPassword } = req.body; 

    try {

        const result = await userService.changeUserPassword(user, newPassword);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

        
    } catch (e) {
        next(e);
    }
}

userController.registerEmployees = async (req, res, next) => {

    if (isUserNotValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const path = req.file.path;
    const user = req.user;

    try {

        const result = await userService.registerEmployees(user, path);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

userController.createUser = async (req, res, next) => {

    if (isUserNotValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const user = req.user
    const { userNik, username, userEmail, userMobileNumber, isMultiApproval, permission } = req.body

    try {
        
        const userDTO = {
            eusernik: userNik,
            eusername: username,
            euseremail: userEmail,
            eusermobilenumber: userMobileNumber,
            eusermultiapproval: isMultiApproval
        }

        const data = await userService.createUser(userDTO, permission, user)

        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch (e) {
        next(e)
    }
}

userController.getUserById = async (req, res, next) => {

    const user = req.user;
    const { userId } = req.params;

    try {

        const result = await userService.getUserById(userId, user);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e);
    }

}

userController.getUserCurrentCompany = async (req, res, next) => {

    const user = req.user;

    try {

        const result = await userService.getUserCurrentCompany(user);

        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(
            result))

    } catch (e) {
        next(e);
    }
}
userController.updateUserById = async (req, res, next) => {

    const user = req.user
    const { userNik, username, userMobileNumber, isMultiApproval, permission, identityNumber } = req.body
    const { userId } = req.params

    try {

        const userDTO = {
            eusernik: userNik,
            eusername: username,
            eusermobilenumber: userMobileNumber,
            eusermultiapproval: isMultiApproval,
            euseridentitynumber: identityNumber
        }

        const data = await userService.updateUserById(userId, userDTO, permission, user)
        if (!data) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch (e) {
        next(e)
    }
}

userController.changeUserCompany = async (req, res, next) => {

    const user = req.user
    const { companyId } = req.body

    try {

        const result = await userService.changeUserCompany(companyId, user)
        if (!result)
            return res.status(404).json(ResponseHelper.toErrorResponse(404))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

userController.deleteUserById = async (req, res, next) => {
        
    const user = req.user;
    const { userId } = req.params;

    try {

        const result = await userService.deleteUserById(userId, user);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e);
    }

}

userController.forgotPassword = async (req, res, next) => {
    
    const email = req.body.email; 

    try {

        const result = await userService.sendForgotPasswordLink( email );

        return res.status(200).json(ResponseHelper.toBaseResponse(result))
        
    } catch (e) {
        next(e);
    }
}

userController.getAllUserByCompanyId = async (req, res, next) => {

    if (isUserNotValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { page, size } = req.query
    const { companyId } = req.params

    try {

        const pageObj = await userService.getAllUserByCompanyId(parseInt(page), parseInt(size), companyId)

        if(!pageObj)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))

        return res.status(200).json(ResponseHelper.toBaseResponse(pageObj.data, pageObj.paging))
 
    } catch(e) {
        next(e);
    }

}

userController.login = async (req, res, next) => {

    const { email, password } = req.body;
    const loginDTO = { 
        euseremail: email, 
        euserpassword: password
    }

    try {

        const result = await userService.login(loginDTO);

        if (!result)
            return res.status(401).json(ResponseHelper.toErrorResponse(401))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

userController.importTemplate = async (req, res, next) => {

    try {

        res.setHeader('Content-disposition', 'attachment; filename=Import Data Karyawan Template.xlsx');
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.download(templatePath);

    } catch(e) {
        next(e);
    }

}

userController.addApprovalUsers = async (req, res, next) => {

    try {
        const {userId, approvalUserIds} = req.body

        const result = userService.addApprovalUsers(userId, approvalUserIds, req.user)
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }
}

module.exports = userController