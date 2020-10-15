const TeamUserMapping = require('../models/TeamUserMapping')
const { NotFoundError } = require('../models/errors')

const teamUserMappingService = {}

teamUserMappingService.createTeamUserMapping = async (mappings, user, trx) => {

    let createPromise

    if(!trx) {

        createPromise = TeamUserMapping
        .query()
        .insertToTable(mappings, user.sub)

    } else {
        createPromise = TeamUserMapping
        .query(trx)
        .insertToTable(mappings, user.sub)

    }

    return createPromise

}

teamUserMappingService.getTeamUsermappingByTeamUserMappingId = async (teamUserMappingId) => {

    return TeamUserMapping.query()
    .findById(teamUserMappingId)
    .then(teamUserMapping => {
        if(!teamUserMapping) throw new NotFoundError()
        return teamUserMapping
    })


}

module.exports = teamUserMappingService