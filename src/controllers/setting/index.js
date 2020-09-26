const SettingService = require('../../services/settingService');
const ResponseHelper = require('../../helper/ResponseHelper');

const Controller = {}

Controller.getModulesByCompanyId = async (req, res, next) => {

    try {
        const result = await SettingService.getModulesByCompanyId(req.user.companyId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

Controller.updateModulesNameByCompanyId = async (req, res, next) => {
    const { moduleId } = req.params
    const { name } = req.body;

    if (req.user.functions.indexOf('U13') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const moduleDTO = {
        id: moduleId,
        name: name
    }

    try {

        const result = await SettingService.updateModuleByCompanyId(req.user.companyId, moduleDTO, req.user);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))

    } catch(e) {
        next(e)
    }

}

Controller.getAllFunctionByGradeId = async (req, res, next) => {

    const { gradeId } = req.params;

    if (req.user.functions.indexOf('R13') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const result = await SettingService.getAllFunctionByGradeId(gradeId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

Controller.saveFunctionsByGradeId = async (req, res, next) => {

    const { gradeId } = req.params;

    const { functions } = req.body;

    if (req.user.functions.indexOf('C13') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const result = await SettingService.saveFunctionsByGradeId(gradeId, functions);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = Controller;