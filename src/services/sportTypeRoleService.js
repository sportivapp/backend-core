const SportTypeRole = require('../models/SportTypeRole')
const ServiceHelper = require('../helper/ServiceHelper')

const sportTypeRoleService = {}

sportTypeRoleService.getSportTypeRoleListByIndustryId = async (page, size, industryId) => {

    return SportTypeRole.query()
    .modify('baseAttributes')
    .where('eindustryeindustryid', industryId)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

module.exports = sportTypeRoleService