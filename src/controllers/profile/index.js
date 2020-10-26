const profileService = require('../../services/profileService')
const ResponseHelper = require('../../helper/ResponseHelper')

const profileController = {}

profileController.changeUserPassword = async (req, res, next) => {

    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    try {

        const result = await profileService.changeUserPassword(user, oldPassword, newPassword);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e);
    }
}

profileController.getUserCurrentCompany = async (req, res, next) => {

    const user = req.user;

    try {

        const result = await profileService.getUserCurrentCompany(user);
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

        const result = await profileService.changeUserCompany(companyId, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch (e) {
        next(e)
    }
}

profileController.getProfile = async (req, res, next) => {

    const user = req.user;

    try {

        const result = await profileService.getProfile(user);
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

        const data = await profileService.updateProfile(userDTO, user)
        return res.status(200).json(ResponseHelper.toBaseResponse(data));

    } catch (e) {
        next(e)
    }
}

profileController.getModules = async (req, res, next) => {

    try {
        const modules = await profileService.getModules(req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(modules))
    } catch (e) {
        next(e)
    }
}

profileController.getAllFunctions = async (req, res, next) => {

    try {
        const functions = await profileService.getFunctions(req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(functions))
    } catch (e) {
        next(e)
    }

}

profileController.getAllFunctionsByModuleId = async (req, res, next) => {

    const { moduleId } = req.params

    try {
        const functions = await profileService.getFunctionsByModuleId(moduleId, req.user)
        return res.status(200).json(ResponseHelper.toBaseResponse(functions))
    } catch (e) {
        next(e)
    }

}

module.exports = profileController