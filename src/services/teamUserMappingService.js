const TeamUserMapping = require('../models/TeamUserMapping')
const TeamLog = require('../models/TeamLog')
const { NotFoundError } = require('../models/errors')
const ServiceHelper = require('../helper/ServiceHelper')
const teamLogService = require('./teamLogService')
const { raw } = require('objection')

const teamUserMappingService = {}

const TeamUserMappingPositionEnum = {
    ADMIN: 'ADMIN'
}

const TeamLogStatusEnum = {
    KICKED: 'KICKED'
}

teamUserMappingService.checkUserInTeamByUserIds = async (teamId, userIds) => {

    return TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .whereIn('eusereuserid', userIds)

}

teamUserMappingService.checkUserInTeam = async (teamId, userId) => {

    return TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', userId)
    .first();

}

teamUserMappingService.isAdmin = async (teamId, userId) => {
    return TeamUserMapping.query()
    .where('eusereuserid', userId)
    .andWhere('eteameteamid', teamId)
    .andWhere('eteamusermappingposition', TeamUserMappingPositionEnum.ADMIN)
    .first()
    .then(user => {
        if(!user) return false
        return user.eteamusermappingposition === TeamUserMappingPositionEnum.ADMIN
    })
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

teamUserMappingService.checkAdminByTeamLogsAndUserId = async (teamLogs, userId) => {

    let teamIds = [];

    for(let i = 0; i < teamLogs.length; i++) {
        teamIds.push(teamLogs[i].eteameteamid);
    }

    const teamIdsUnique = teamIds.filter(onlyUnique);

    const counts = await TeamUserMapping.query()
        .whereIn('eteameteamid', teamIdsUnique)
        .where('eusereuserid', userId)
        .andWhere('eteamusermappingposition', TeamUserMappingPositionEnum.ADMIN)
        .count();

    return teamIdsUnique.length === parseInt(counts[0].count);
    
}

teamUserMappingService.getTeamMemberCount = async (teamId) => {

    const teamMemberCount = await TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .count()
    .first();

    return parseInt(teamMemberCount.count);
    
}

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

teamUserMappingService.getTeamIdsByUser = async (user) => {

    return TeamUserMapping.query()
    .where('eusereuserid', user.sub)
    .then(teamUserMappings => {
        return teamUserMappings.map(teamUserMapping => teamUserMapping.eteameteamid)
    })

}

teamUserMappingService.getTeamMemberListByTeamId = async (page, size, teamId, keyword) => {

    return TeamUserMapping.query()
    .modify('baseAttributes')
    .joinRelated('user')
    .where('eteameteamid', teamId)
    .whereRaw(`LOWER("eusername") LIKE '%${keyword}%'`)
    .withGraphFetched('teamSportTypeRoles(baseAttributes)')
    .withGraphFetched('user(baseAttributes).file(baseAttributes)')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

// TODO: THIS IS TEMPORARILY BECAUSE OF CIRCULAR DEPENDENCY
teamUserMappingService.updateKickedTeamLog = async (teamId, user, userId, logMessage, trx) => {

    return TeamLog.query(trx)
    .where('eteameteamid', teamId)
    .where('eusereuserid', userId)
    .updateByUserId({
        eteamlogstatus: TeamLogStatusEnum.KICKED,
        eteamlogmessage: logMessage
    }, user.sub)

}

teamUserMappingService.removeUserFromTeam = async (userInTeam, user, userId, type, logMessage) => {

    return TeamUserMapping.transaction(async trx => {

        // if user kicked
        if(type === TeamLogStatusEnum.KICKED) {
            await teamUserMappingService.updateKickedTeamLog(userInTeam.eteameteamid, user, userId, logMessage, trx)
        }

        return userInTeam.$query(trx)
        .delete()
        .then(rowsAffected => rowsAffected === 1);

    })

}

module.exports = teamUserMappingService