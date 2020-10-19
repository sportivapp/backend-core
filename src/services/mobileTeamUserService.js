const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const TeamUserMapping = require('../models/TeamUserMapping');
const { raw } = require('objection')
const mobileTeamSportTypeRoleService = require('./mobileTeamSportTypeRoleService')

const TeamUserMappingPositionEnum = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER'
}

const ErrorEnum = {
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    NOT_ADMIN: 'NOT_ADMIN',
    POSITION_UNACCEPTED: 'POSITION_UNACCEPTED',
    LAST_ADMIN: 'LAST_ADMIN',
    NOT_ADMIN: 'NOT_ADMIN',
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM'
}

const teamUserService = {};

teamUserService.getTeamUserCheckAdmin = async (teamId, userId) => {

    const teamUser = await teamUserService.getTeamUserByTeamIdAndUserId(teamId, userId);

    if (teamUser.eteamusermappingposition !== TeamUserMappingPositionEnum.ADMIN)
        throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN);

    return true;

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

teamUserService.checkAdminByTeamLogsAndUserId = async (teamLogs, userId) => {

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

teamUserService.getTeamUserByTeamIdAndUserId = async (teamId, userId) => {

    return TeamUserMapping.query()
        .where('eteameteamid', teamId)
        .andWhere('eusereuserid', userId)
        .first()
        .then(member => {
            if (!member)
                throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_TEAM);
            return member
        });

}

teamUserService.removeUserFromTeam = async (teamId, userId) => {

    return teamUserService.getTeamUserByTeamIdAndUserId(teamId, userId)
        .then(teamUserMapping => {

            return teamUserMapping.$query()
                .del()
                .then(rowsAffected => rowsAffected === 1);
                
        });

}

teamUserService.getAdminCountByTeamId = async (teamId) => {

    const adminCount = await TeamUserMapping.query()
        .where('eteameteamid', teamId)
        .andWhere('eteamusermappingposition', TeamUserMappingPositionEnum.ADMIN)
        .count();

    return adminCount[0].count;

}

teamUserService.exitTeam = async (teamId, user) => {

    await teamUserService.getAdminCountByTeamId(teamId)
        .then(adminCount => {
            if (adminCount === 1)
                throw new UnsupportedOperationError(ErrorEnum.LAST_ADMIN);
        });

    return teamUserService.removeUserFromTeam(teamId, user.sub);

}

teamUserService.getTeamMemberList = async (teamId, page, size, keyword) => {

    return TeamUserMapping.query()
        .leftJoinRelated('user')
        .modify('baseAttributes')
        .where('eteameteamid', teamId)
        .withGraphFetched('teamSportTypeRoles(baseAttributes)')
        .withGraphFetched('user(baseAttributes)')
        .where(raw('lower("eusername")'), 'like', `%${keyword}%`)
        .page(page, size)
        .then(members =>
            ServiceHelper.toPageObj(page, size, members)
        );

}

teamUserService.getTeamUsermappingByTeamUserMappingId = async (teamUserMappingId) => {

    return TeamUserMapping.query()
    .findById(teamUserMappingId)
    .then(teamUserMapping => {
        if(!teamUserMapping) throw new NotFoundError()
        return teamUserMapping
    })

}

teamUserService.changeTeamMemberSportRoles = async (teamUserMappingId, user, sportRoleIds) => {

    sportRoleIds = (!sportRoleIds || sportRoleIds.length === 0 ) ? null : sportRoleIds

    const teamUserMapping = await teamUserService.getTeamUsermappingByTeamUserMappingId(teamUserMappingId)
    .catch( () => null)

    if(!teamUserMapping) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_TEAM)

    const isAdmin = await teamUserService.getTeamUserCheckAdmin(teamUserMapping.eteameteamid, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN)

    return mobileTeamSportTypeRoleService
    .insertTeamSportTypeRoles(teamUserMappingId, teamUserMapping.eteameteamid, sportRoleIds, user)

}

teamUserService.changeTeamMemberPosition = async (teamId, userId, user, position) => {

    if (!TeamUserMappingPositionEnum.hasOwnProperty(position))
        throw new UnsupportedOperationError(ErrorEnum.POSITION_UNACCEPTED);

    if (user.sub === userId)
        throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION);

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    const teamUser = await teamUserService.getTeamUserByTeamIdAndUserId(teamId, userId);

    return teamUser.$query()
        .updateByUserId({ eteamusermappingposition: position }, user.sub)
        .returning('*');

}

teamUserService.kickMember = async (teamId, userId, user) => {

    if (user.sub === userId)
        throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    const teamUser = await teamUserService.getTeamUserByTeamIdAndUserId(teamId, userId);

    return teamUserService.removeUserFromTeam(teamId, teamUser.eusereuserid);

}

teamUserService.initializeTeamAdmin = async (teamId, user, db = TeamUserMapping.knex()) => {

    return TeamUserMapping.query(db)
        .insertToTable({
            eteameteamid: teamId,
            eusereuserid: user.sub,
            eteamusermappingposition: TeamUserMappingPositionEnum.ADMIN
        }, user.sub);

}

teamUserService.joinTeamByTeamLogs = async (teamLogs, user, position = TeamUserMappingPositionEnum.MEMBER) => {

    const mappings = teamLogs.map(teamLog => ({
        eteameteamid: teamLog.eteameteamid,
        eusereuserid: teamLog.eusereuserid,
        eteamusermappingposition: position
    }))

    return TeamUserMapping.query()
        .insertToTable(mappings, user.sub);

}

teamUserService.getTeamIdsByUser = async (user) => {

    return TeamUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(teamUserMappings => {
            return teamUserMappings.map(teamUserMapping => teamUserMapping.eteameteamid)
        });

}

module.exports = teamUserService;