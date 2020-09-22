const userService = require('../../services/userService')
const ResponseHelper = require('../../helper/ResponseHelper')

const profileController = {}

profileController.changeUserPassword = async (req, res, next) => {

    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    try {

        const result = await userService.changeUserPassword(user, oldPassword, newPassword);

        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))


    } catch (e) {
        next(e);
    }
}

profileController.getUserCurrentCompany = async (req, res, next) => {

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

profileController.changeUserCompany = async (req, res, next) => {

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

profileController.getProfile = async (req, res, next) => {

    const user = req.user;

    try {

        const result = await userService.getProfile(user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e);
    }

}

profileController.updateProfile = async (req, res, next) => {

    const user = req.user
    const {
        username,
        userMobileNumber,
        gender,
        hobby,
        address,
        identityNumber
    } = req.body

    try {

        const userDTO = {
            eusername: username,
            eusermobilenumber: userMobileNumber,
            eusergender: gender,
            euserhobby: hobby,
            euseridentitynumber: identityNumber,
            euseraddress: address
        }

        const data = await userService.updateProfile(userDTO, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch (e) {
        next(e)
    }
}

module.exports = profileController