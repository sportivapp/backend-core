const userService = require('../../services/userService')
const ResponseHelper = require('../../helper/ResponseHelper')
const templatePath = require('../../../templates/index');

const userController = {}

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

    if (req.user.functions.indexOf('C5') === -1)
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

    if (req.user.functions.indexOf('C5') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const user = req.user
    const {
        userNik,
        username,
        userEmail,
        userMobileNumber,
        gender,
        hobby,
        address,
        identityNumber
    } = req.body

    try {
        
        const userDTO = {
            eusernik: userNik,
            eusername: username,
            euseremail: userEmail,
            eusermobilenumber: userMobileNumber,
            eusergender: gender,
            euserhobby: hobby,
            euseridentitynumber: identityNumber,
            euseraddress: address
        }

        const data = await userService.createUser(userDTO, user)

        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch (e) {
        next(e)
    }
}

userController.getUserById = async (req, res, next) => {

    const user = req.user;
    const { userId } = req.params;

    if (req.user.functions.indexOf('R5') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

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

    if (req.user.functions.indexOf('R1') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

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
    const {
        userNik,
        username,
        userMobileNumber,
        gender,
        hobby,
        address,
        identityNumber
    } = req.body
    const { userId } = req.params

    if (req.user.functions.indexOf('U5') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const userDTO = {
            eusernik: userNik,
            eusername: username,
            eusermobilenumber: userMobileNumber,
            eusergender: gender,
            euserhobby: hobby,
            euseridentitynumber: identityNumber,
            euseraddress: address
        }

        const data = await userService.updateUserById(userId, userDTO, user)
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

    if (req.user.functions.indexOf('D5') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const result = await userService.deleteUserById(userId, user);
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

    if (req.user.functions.indexOf('R5') === -1)
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

    if (req.user.functions.indexOf('C6') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

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