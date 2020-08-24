const CompanyModuleMapping = require('../models/CompanyModuleMapping');
const Function = require('../models/Function');
const GradeFunctionMapping = require('../models/GradeFunctionMapping');
const Grade = require('../models/Grades');

const SettingService = {};

SettingService.getModulesByCompanyId = async ( companyId ) => {
    
    const modules = await CompanyModuleMapping.query()
    .select('ecompanymodulemappingname', 'emoduleemoduleid')
    .where('ecompanyecompanyid', companyId);

    if (modules.length === 0)
        return;
 
    return modules;

}

SettingService.getModuleById = async (companyId, moduleId) => {

    const module = await CompanyModuleMapping.query()
        .where('ecompanyecompanyid', companyId)
        .andWhere('emoduleemoduleid', moduleId)
        .first();

    return module;

}

SettingService.updateModuleByCompanyId = async ( companyId, moduleDTO, user ) => {

    const module = await SettingService.getModuleById(companyId, moduleDTO.emoduleemoduleid);

    if (!module)
        return

    return module.$query().updateByUserId(moduleDTO, user.sub)

}

SettingService.getAllFunctionByGradeId = async (gradeId) => {

    const allFunctions = await Function.query();

    // get all functions assigned to this grade
    const myGradeFunctions = await Grade.query()
    .joinRelated('functions')
    .select('efunctionefunctioncode')
    .where('egradeegradeid', gradeId);

    // create object with (key, value) = (functioncode, true)
    let gradeFunctionCodes = {};
    for (let i=0; i<myGradeFunctions.length; i++) {
        gradeFunctionCodes[myGradeFunctions[i].efunctionefunctioncode] = true;
    }

    let groupedFunction = {};
    for (let i=0; i<allFunctions.length; i++) {
        let moduleId = allFunctions[i].efunctioncode.substring(1);

        if (typeof groupedFunction[moduleId] === 'undefined') {
            groupedFunction[moduleId] = [];
        }

        let status = false;
        if (gradeFunctionCodes.hasOwnProperty(allFunctions[i].efunctioncode)) {
            status = true;
        }

        groupedFunction[moduleId].push({
            code: allFunctions[i].efunctioncode,
            name: allFunctions[i].efunctionname,
            status: status
        });
    }

    return groupedFunction;

}

SettingService.deleteFuncionsByGradeId = async (gradeId) => {

    return GradeFunctionMapping.query().where('egradeegradeid', gradeId).del();

}

SettingService.saveFuncionsByGradeId = async (gradeId, functionDTO) => {

    await SettingService.deleteFuncionsByGradeId(gradeId);

    const gradeFunctionDTO = functionDTO.map(funcDTO => {
        return {
            egradeegradeid: gradeId,
            efunctionefunctioncode: funcDTO.code,
        }
    });

    return GradeFunctionMapping.query().insert(gradeFunctionDTO);

}

module.exports = SettingService;