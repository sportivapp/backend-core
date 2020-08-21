const CompanyModuleMapping = require('../models/CompanyModuleMapping');

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

SettingService.updateModulesByCompanyId = async ( companyId, moduleDTO, user ) => {

    const module = await SettingService.getModuleById(companyId, moduleDTO.emoduleemoduleid);

    if (!module)
        return

    return module.$query().updateByUserId(moduleDTO, user.sub)

}

module.exports = SettingService;