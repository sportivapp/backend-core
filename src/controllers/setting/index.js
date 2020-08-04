const SettingService = require('../../services/settingService');
const ResponseHelper = require('../../helper/ResponseHelper');

const Controller = {}

function isUserValid(user) {
    return user.permission === 10
}

Controller.getModulesByCompanyId = async (req, res, next) => {

    const { companyId } = req.params

    try {
        const result = await SettingService.getModulesByCompanyId(companyId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

module.exports = Controller;