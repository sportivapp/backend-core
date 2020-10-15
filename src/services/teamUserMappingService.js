const TeamUserMapping = require('../models/TeamUserMapping')

const teamUserMappingService = {}

teamUserMappingService.createTeamUserMapping = async (mappings, user) => {

    return TeamUserMapping
    .query()
    .insertToTable(mappings, user.sub)

}

module.exports = teamUserMappingService