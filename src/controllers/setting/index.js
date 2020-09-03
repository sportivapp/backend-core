const SettingService = require('../../services/settingService');
const ResponseHelper = require('../../helper/ResponseHelper');

const Controller = {}

Controller.getModulesByCompanyId = async (req, res, next) => {

    const { companyId } = req.params

    try {
        const result = await SettingService.getModulesByCompanyId(companyId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

Controller.updateModulesNameByCompanyId = async (req, res, next) => {

    const { companyId } = req.params;
    const { moduleId, moduleName } = req.body;

    if (req.user.functions.indexOf('U13') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    const moduleDTO = {
        emoduleemoduleid: moduleId,
        ecompanymodulemappingname: moduleName
    }

    try {

        const result = await SettingService.updateModulesByCompanyId(companyId, moduleDTO, req.user);
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

Controller.saveFuncionsByGradeId = async (req, res, next) => {

    const { gradeId } = req.params;

    // [   
    //     {
    //         "code": "C1",
    //         "name": "Create Company",
    //         "status": true
    //     },
    //     {
    //         "code": "C2",
    //         "name": "Create Branch",
    //         "status": true
    //     }
    // ]
    const functionDTO = req.body;

    if (req.user.functions.indexOf('C13') === -1)
        return res.status(403).json(ResponseHelper.toErrorResponse(403))

    try {

        const result = await SettingService.saveFuncionsByGradeId(gradeId, functionDTO);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

Controller.getModulesByUserId = async (req, res, next) => {

    const { userId } = req.params

    try {
        const result = await SettingService.getModulesByUserId(userId);
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

module.exports = Controller;