const CompanyModuleMapping = require('../models/CompanyModuleMapping');

const SettingService = {};

SettingService.getModulesByCompanyId = async ( companyId ) => {
    
    const modules = await CompanyModuleMapping.query()
    .select('ecompanymodulemappingname', 'emoduleemoduleid')
    .where('ecompanyecompanyid', companyId);
 
    return modules;

}

module.exports = SettingService;