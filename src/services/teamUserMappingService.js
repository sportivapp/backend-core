const TeamUserMapping = require('../models/TeamUserMapping')

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

module.exports = teamUserMappingService