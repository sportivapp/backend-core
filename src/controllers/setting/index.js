const SettingService = require('../../services/settingService');
const ResponseHelper = require('../../helper/ResponseHelper');

const Controller = {}

Controller.getModulesByCompanyId = async (req, res, next) => {

    const { companyId } = req.params

    try {
        const result = await SettingService.getModulesByCompanyId(companyId);
        if (!result)
            return res.status(400).json(ResponseHelper.toErrorResponse(400))
        return res.status(200).json(ResponseHelper.toBaseResponse(result))
    } catch (e) {
        next(e)
    }

}

Controller.updateModulesNameByCompanyId = async (req, res, next) => {

    const { companyId } = req.params;
    const { moduleId, moduleName } = req.body;

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

    try {

        const result = await SettingService.saveFuncionsByGradeId(gradeId, functionDTO);
        return res.status(200).json(ResponseHelper.toBaseResponse(result));

    } catch(e) {
        next(e);
    }

}

module.exports = Controller;