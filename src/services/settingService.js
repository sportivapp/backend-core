const CompanyModuleMapping = require('../models/CompanyModuleMapping');

const SettingService = {};

SettingService.getModulesByCompanyId = async ( companyId ) => {
    
    const modules = await CompanyModuleMapping.query().where('ecompanyecompanyid', companyId);
 
    return modules;

}