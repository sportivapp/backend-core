const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const TeamUserMapping = require('../models/TeamUserMapping');

const TeamUserMappingPositionEnum = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER'
}

const ErrorEnum = {
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    NOT_ADMIN: 'NOT_ADMIN',
    POSITION_UNACCEPTED: 'POSITION_UNACCEPTED',
    LAST_ADMIN: 'LAST_ADMIN'
}

const teamUserService = {};

teamUserService.getTeamUserCheckAdmin = async (teamId, userId) => {

    const teamUser = await teamUserService.getTeamUserByTeamIdAndUserId(teamId, userId);

    if (teamUser.eteamusermappingposition !== TeamUserMappingPositionEnum.ADMIN)
        throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN);

    return true;

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

teamUserService.getTeamMemberList = async (teamId, page, size) => {

    return TeamUserMapping.query()
        .modify('baseAttributes')
        .where('eteameteamid', teamId)
        .withGraphFetched('user(baseAttributes)')
        .page(page, size)
        .then(members =>
            ServiceHelper.toPageObj(page, size, members)
        );

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

teamUserService.joinTeam = async (teamId, userId, user, position = TeamUserMappingPositionEnum.MEMBER, 
    db = TeamUserMapping.knex()) => {

    return TeamUserMapping.query(db)
        .insertToTable({
            eteameteamid: teamId,
            eusereuserid: userId,
            eteamusermappingposition: position
        }, user.sub);

}

teamUserService.joinTeamByTeamLogs = async (teamLogs, user, position = TeamUserMappingPositionEnum.MEMBER, 
    db = TeamUserMapping.knex()) => {

    const mappings = teamLogs.map(teamLog => ({
        eteameteamid: teamLog.eteameteamid,
        eusereuserid: teamLog.eusereuserid,
        eteamusermappingposition: position
    }))

    return TeamUserMapping.query(db)
        .insertToTable(mappings, user.sub);

}

module.exports = teamUserService;