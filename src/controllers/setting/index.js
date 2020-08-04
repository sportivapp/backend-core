const SettingService = require('../../services/settingService');
const ResponseHelper = require('../../helper/ResponseHelper');

const Controller = {}

function isUserValid(user) {
    return user.permission === 10
}

Controller.getModules = async (req, res, next) => {

    if(!isUserValid(req.user))
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const { companyId } = req.params

    try {
        const result = await SettingService.getModules(companyId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

module.exports = Controller;