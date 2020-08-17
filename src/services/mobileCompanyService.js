const Company = require('../models/Company')
const { raw } = require('objection')

const companyService = {}

companyService.getCompany = async (companyId) => {

    const company = await Company.query()
    
    .where('ecompanyid', companyId);

    if (!company)
        return
    
    return company

}

companyService.getCompanies = async (keyword) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    return Company.query()
        .select('ecompanyid', 'ecompanyname', 'ecompanyaddress', 'ecompanylogo')
        .where('ecompanyolderid', null)
        .andWhere('ecompanyparentid', null)
        .andWhere(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
}

module.exports = companyService