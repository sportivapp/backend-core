const CompanyModuleMapping = require('../models/CompanyModuleMapping');
const Function = require('../models/Function');
const GradeFunctionMapping = require('../models/GradeFunctionMapping');
const Grade = require('../models/Grades');
const Module = require('../models/Module')

const SettingService = {};

SettingService.getModulesByCompanyId = async ( companyId ) => {

    return CompanyModuleMapping.relatedQuery('module')
        .for(CompanyModuleMapping.query().where('ecompanyecompanyid', companyId));

}

SettingService.getModulesByName = async (name) => {
    return Module.query()
        .where('emodulename', name)
}

SettingService.getModulesByUserId = async ( userId ) => {

    const moduleIds = await Grade.relatedQuery('functions')
        .for(Grade.query().joinRelated('users').where('eusereuserid', userId))
        .then(functions => functions.map(func => func.emoduleemoduleid))

    return Module.query().whereIn('emoduleid', moduleIds);

}

SettingService.getModulesByGradeIds = async (gradeIds) => {

    const functionObj = await SettingService.getAllFunctionByGradeIds(gradeIds);

    const moduleIds = []

    let isModuleValid

    for (let key in functionObj) {
        isModuleValid = true
        for (let func in functionObj[key]) {
            if (!func.status) isModuleValid = false
        }
        if (isModuleValid) moduleIds.push(key)
    }

    return Module.query()
        .whereIn('emoduleid', moduleIds)
}

SettingService.getModuleById = async (companyId, moduleId) => {

    const module = await CompanyModuleMapping.relatedQuery('module')
        .for(CompanyModuleMapping.query()
            .where('ecompanyecompanyid', companyId)
            .andWhere('emoduleemoduleid', moduleId))
        .first();

    return module;

}

SettingService.getDefaultModuleByCompanyId = async (companyId) => {
    return CompanyModuleMapping.query()
        .where('ecompanyecompanyid', companyId)
        .orderBy('emoduleemoduleid', 'ASC')
        .first()
        .withGraphFetched('module')
        .then(mapping => mapping.module)
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
    for (let i = 0; i < myGradeFunctions.length; i++) {
        gradeFunctionCodes[myGradeFunctions[i].efunctionefunctioncode] = true;
    }

    let groupedFunction = {};
    for (let i = 0; i < allFunctions.length; i++) {
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

SettingService.getAllFunctionByGradeIds = async (gradeIds) => {

    const allFunctions = await Function.query();

    // get all functions assigned to this grade
    const myGradeFunctions = await Grade.query()
        .joinRelated('functions')
        .distinct('efunctionefunctioncode')
        .whereIn('egradeegradeid', gradeIds);

    // create object with (key, value) = (functioncode, true)
    let gradeFunctionCodes = {};
    for (let i = 0; i < myGradeFunctions.length; i++) {
        gradeFunctionCodes[myGradeFunctions[i].efunctionefunctioncode] = true;
    }

    let groupedFunction = {};
    for (let i = 0; i < allFunctions.length; i++) {
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