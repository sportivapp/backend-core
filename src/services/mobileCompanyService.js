const Company = require('../models/Company')
const { raw } = require('objection');

const companyService = {}

companyService.getCompany = async (companyId) => {

    const companyDetailPromise = Company.query()
    .select('efileefileid', 'ecompanyname', 'eindustryname', 'eaddressstreet', 'ecompanyphonenumber', 'ecompanyemailaddress')
    .joinRelated('address')
    .joinRelated('industry')
    .where('ecompanyid', companyId)
    .first();
    
    const departmentWithHeadPromise = Company.query()
    .select('edepartmentname', 'eusername')
    .withGraphJoined('departments.positions.users')
    .where('ecompany.ecompanyid', companyId)
    .andWhere('egradesuperiorid', null);

    const branchesPromise = Company.query()
    .select('branches.ecompanyid', 'branches.ecompanyname')
    .joinRelated('branches')
    .where('ecompany.ecompanyid', companyId);

    const result = await Promise.all([companyDetailPromise, departmentWithHeadPromise, branchesPromise])
        .then();

    let departmentWithHead = [];
    for (let i=0; i<result[1].length; i++) {
        departmentWithHead.push({
            edepartmentname: result[1][i].edepartmentname,
            eusername: result[1][i].eusername
        })
    }

    returnedData = {
        company: result[0],
        departments: departmentWithHead,
        branches: result[2]
    }

    return returnedData;

}

companyService.getCompanies = async (keyword) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    return Company.query()
        .select('ecompanyid', 'ecompanyname', 'eindustryname', 'eaddressstreet', 'efileefileid')
        .joinRelated('address')
        .joinRelated('industry')
        .where('ecompanyolderid', null)
        .andWhere('ecompanyparentid', null)
        .andWhere(raw('lower("ecompanyname")'), 'like', `%${newKeyword}%`)
}

companyService.getVirtualMemberCard = async (companyId, user) => {

    const userInCompany = await Company.query()
        .joinRelated('users')
        .where('ecompanyid', companyId)
        .andWhere('euserid', user.sub)
        .first();

    if (!userInCompany)
        return

    const virtualMemberCard = await Company.query()
        .select('ecompany.efileefileid', 'ecompanyname', 'eusername', 'egradename')
        .withGraphJoined('users.grades')
        .where('ecompanyid', companyId)
        .andWhere('euserid', user.sub)
        .first();

    return {
        efileefileid: virtualMemberCard.efileefileid,
        ecompanyname: virtualMemberCard.ecompanyname,
        eusername: virtualMemberCard.eusername,
        egradename: virtualMemberCard.egradename
    }

}

companyService.getCompanyEmployees = async (companyId) => {

    const companyEmployees = await Company.query()
    .withGraphJoined('departments.positions.users')
    .where('ecompanyid', companyId);

    // for (let i=0; i<companyEmployees; i++) {
            
    // }

}

module.exports = companyService