const Industry = require('../models/Industry')
const { raw } = require('objection')

const industryService = {}

industryService.getIndustryList = async (keyword) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    return Industry.query()
        .select('eindustryid', 'eindustryname')
        .where(raw('lower("eindustryname")'), 'like', `%${newKeyword}%`)
}

industryService.getIndustryListWithLicenseLevel = async () => {

    return Industry.query()
        .modify('baseAttributesWithLicenseLevels')
        .withGraphFetched('licenseLevels');

}

industryService.getIndustryById = async (industryId) => {

    return Industry.query()
        .findById(industryId)
}

module.exports = industryService