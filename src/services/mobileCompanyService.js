const Company = require('../models/Company')
const { raw } = require('objection');
const Department = require('../models/Department');

const companyService = {}

companyService.getCompany = async (companyId) => {
    
    return
    
    // const companyPromise = Company.query()
    // .select('ecompanyname', 'eindustryname', 'eaddressstreet', 'ecompanyemailaddress', 'ecompanymobilenumber')
    // .joinRelated('address')
    // .joinRelated('industry')
    // .where('ecompanyid', companyId);

    // const departmentPromise = Department.query()

    // const department = await departmentPromise
    // console.log(department);

    // if (!company)
    //     return
    
    // return company

}

companyService.getCompanies = async (keyword) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    return Company.query()
        .select('ecompanyid', 'ecompanyname', 'eindustryname', 'eaddressstreet', 'ecompanylogo')
        .joinRelated('address')
        .joinRelated('industry')
        .where('ecompanyolderid', null)
        .andWhere('ecompanyparentid', null)
        .andWhere(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
}

module.exports = companyService