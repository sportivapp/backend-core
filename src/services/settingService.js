const CompanyModuleMapping = require('../models/CompanyModuleMapping');
const Function = require('../models/Function');
const GradeFunctionMapping = require('../models/GradeFunctionMapping');
const Grade = require('../models/Grades');
const gradeService = require('./gradeService')
const { raw } = require('objection')
const Module = require('../models/Module')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')

const SettingService = {};

SettingService.getModulesByCompanyId = async (companyId) => {

    if (!companyId) return []

    return CompanyModuleMapping.query()
        .select('module.emoduleid')
        .select('ecompanymodulemappingname as emodulename')
        .joinRelated('module')
        .where('ecompanyecompanyid', companyId)
        .orderBy('emoduleemoduleid', 'ASC')

}

SettingService.getModuleByNameAndCompanyId = async (name, companyId) => {

    return CompanyModuleMapping.relatedQuery('module')
        .for(CompanyModuleMapping.query().where('ecompanyecompanyid', companyId))
        .where('emodulename', name)
        .first()
}

SettingService.isUserHaveFunctions = async (codes, gradeIds, moduleName, companyId) => {

    const moduleId = await SettingService.getModuleByNameAndCompanyId(moduleName, companyId)
        .then(module => module.emoduleid)

    const functionCodes = await SettingService.getAllFunctionCodesByGradeIds(gradeIds)

    return codes.map(code => `${code}${moduleId}`)
        .map(code => functionCodes.indexOf(code))
        .filter(result => result !== -1)
        .length === codes.length
}

SettingService.getModulesByIds = async (companyId, moduleIds) => {

    if (!companyId) return []

    return CompanyModuleMapping.query()
        .select('module.emoduleid')
        .select('ecompanymodulemappingname as emodulename')
        .joinRelated('module')
        .where('ecompanyecompanyid', companyId)
        .whereIn('emoduleemoduleid', moduleIds)
        .orderBy('emoduleemoduleid', 'ASC')

}

SettingService.getModulesByGradeIds = async (companyId, gradeIds) => {

    const functionObj = await SettingService.getAllFunctionByGradeIds(gradeIds);

    const moduleIds = []

    let isModuleValid

    for (let key in functionObj) {
        isModuleValid = true
        functionObj[key].forEach(func => {
            if (!func.status) isModuleValid = false
        })
        if (isModuleValid) moduleIds.push(key)
    }

    return SettingService.getModulesByIds(companyId, moduleIds)
}

SettingService.getDefaultModuleByCompanyId = async (companyId) => {
    return CompanyModuleMapping.query()
        .where('ecompanyecompanyid', companyId)
        .orderBy('emoduleemoduleid', 'ASC')
        .first()
        .withGraphFetched('module')
        .then(mapping => mapping.module)
}

SettingService.updateModuleByCompanyId = async (companyId, moduleDTO, user) => {

    if (!companyId) throw new UnsupportedOperationError('USER_NOT_IN_ORGANIZATION')

    const module = await CompanyModuleMapping.query()
        .where('ecompanyecompanyid', companyId)
        .andWhere('emoduleemoduleid', moduleDTO.id)
        .first()

    if (!module)
        throw new UnsupportedOperationError('MODULE_NOT_FOUND')

    return module.$query().updateByUserId({ ecompanymodulemappingname: moduleDTO.name }, user.sub)
        .returning('*')

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

SettingService.getAllFunctionCodesByGradeIds = async (gradeIds) => {

    return Grade.query()
        .joinRelated('functions')
        .distinct('efunctionefunctioncode')
        .whereIn('egradeegradeid', gradeIds)
        .then(funcList => funcList.map(func => func.efunctionefunctioncode));

}

SettingService.deleteFunctionsByGradeId = async (gradeId, trx) => {

    return GradeFunctionMapping.query(trx).where('egradeegradeid', gradeId).del();

}

SettingService.saveFunctionsByGradeId = async (gradeId, functionDTOs) => {

    await gradeService.getGradeById(gradeId)
        .then(grade => {
            if (!grade) throw new UnsupportedOperationError('GRADE_NOT_FOUND')
        })

    return GradeFunctionMapping.transaction(async trx => {

        return GradeFunctionMapping.query(trx)
            .where('egradeegradeid', gradeId)
            .del()
            .then(ignored => functionDTOs.filter(funcDTO => funcDTO.status)
                .map(funcDTO => ({
                egradeegradeid: gradeId,
                efunctionefunctioncode: funcDTO.code
            })))
            .then(gradeFunctionDTO => GradeFunctionMapping.query(trx).insert(gradeFunctionDTO));
    })

}

SettingService.mapFunctionsToGrade = async (gradeId, codes, trx) => {

    return GradeFunctionMapping.query(trx)
        .where('egradeegradeid', gradeId)
        .del()
        .then(ignored => codes.map(code => ({
            egradeegradeid: gradeId,
            efunctionefunctioncode: code,
        })))
        .then(dtos => {
            return dtos
        })
        .then(gradeFunctionDTOs => GradeFunctionMapping.query(trx).insert(gradeFunctionDTOs));

}

SettingService.getAllModules = async () => {

    return Module.query()
}

SettingService.getAllFunctions = async (codeKeyword = '') => {

    console.log(codeKeyword)

    return Function.query()
        .where(raw('lower("efunctioncode")'), 'like', `%${codeKeyword}%`)
}

module.exports = SettingService;