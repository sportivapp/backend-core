const userService = require('../../services/userService')
const ResponseHelper = require('../../helper/ResponseHelper')

const userController = {}

userController.register = async (req, res, next) => {

    const { email, mobileNumber, password, otpCode } = req.body;

    const userDTO = {
        euseremail: email.toLowerCase(),
        eusermobilenumber: mobileNumber,
        euserpassword: password
    }

    try {

        const result = await userService.register(userDTO, otpCode);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
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

userController.getOtherUserById = async (req, res, next) => {

    const { userId, companyId } = req.body;
    const { type } = req.query;

    if (req.user.functions.indexOf('R5') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const result = await userService.getOtherUserById(userId, type.toUpperCase(), companyId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
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
        identityNumber,
        fileId,
        cityId,
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
            euseraddress: address,
            efileefileid: fileId,
            ecityecityid: cityId,
        }

        const data = await userService.updateUserById(userId, userDTO, user)
        if (!data) return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(data));

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

        if (result === undefined)
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

    if (req.user.functions.indexOf('R5') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { page, size } = req.query
    const { companyId } = req.params

    try {

        const pageObj = await userService.getAllUserByCompanyId(parseInt(page), parseInt(size), companyId)

        if(!pageObj)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging))
 
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

        // res.cookie('tok', result, {
        //     secure: true,
        //     httpOnly: true,
        //     domain: process.env.COOKIE_DOMAIN,
        //     maxAge: 15 * 60 * 1000
        // })

        return res.cookie('tok', result, {
            // secure: true,
            // httpOnly: true,
            // domain: process.env.COOKIE_DOMAIN,
            maxAge: 15 * 60 * 1000
        }).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e);
    }

}

userController.getUsersByName = async (req, res, next) => {

    const { page, size, keyword } = req.query;

    try {

        const pageObj = await userService.getUsersByName(parseInt(page), parseInt(size), keyword);

        return res.status(200).json(ResponseHelper.toPageResponse(pageObj.data, pageObj.paging));
 
    } catch(e) {
        next(e);
    }

}

module.exports = userController