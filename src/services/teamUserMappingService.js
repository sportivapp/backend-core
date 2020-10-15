const TeamUserMapping = require('../models/TeamUserMapping')
const { NotFoundError } = require('../models/errors')
const ServiceHelper = require('../helper/ServiceHelper')

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

teamUserMappingService.getTeamByUserId = async (page, size, userId) => {

    return TeamUserMapping.query()
    .modify('baseAttributes')
    .where('eusereuserid', userId)
    .withGraphFetched('team(baseAttributes).teamPicture(baseAttributes)')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

module.exports = teamUserMappingService