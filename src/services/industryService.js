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

module.exports = industryService