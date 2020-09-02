const Team = require('../models/Team')
const ServiceHelper = require('../helper/ServiceHelper');
const { raw } = require('objection');

const teamService = {}

teamService.getTeamByCompanyId = async (page, size, companyId) => {

    if(isNaN(page) || isNaN(size)) {
        page = 0
        size = 10
    }
    
    if(isNaN(companyId))
        return

    const teamList = Team.query()
    .select()
    .where('ecompanyecompanyid', companyId)
    .page(page, size)

    if (!teamList)
        return

    return Promise.all([teamList])
    .then(result => ({
        teams: result[0]
    }))

}

module.exports = teamService