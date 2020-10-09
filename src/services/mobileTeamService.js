const TeamUserMapping = require('../models/TeamUserMapping');
const TeamIndustryMapping = require('../models/TeamIndustryMapping');
const TeamLog = require('../models/TeamLog');
const Team = require('../models/Team');
const User = require('../models/User');
const ServiceHelper = require('../helper/ServiceHelper');
const { raw } = require('objection');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    NOT_ADMIN: 'NOT_ADMIN',
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM',
    TEAM_NOT_FOUND: 'TEAM_NOT_FOUND',
    USER_APPLIED: 'USER_APPLIED',
    USER_IN_TEAM: 'USER_IN_TEAM',
    USER_NOT_INVITED: 'USER_NOT_INVITED',
    STATUS_UNACCEPTED: 'STATUS_UNACCEPTED',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    TYPE_UNACCEPTED: 'TYPE_UNACCEPTED',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    POSITION_UNACCEPTED: 'POSITION_UNACCEPTED'
}

const teamService = {}

teamService.getTeams = async (keyword, page = 0, size = 10) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    const teamsPage = await Team.query()
    .modify('baseAttributes')
    .withGraphFetched('company(baseAttributes)')
    .where(raw('lower("eteamname")'), 'like', `%${newKeyword}%`)
    .page(page, size);

    return ServiceHelper.toPageObj(page, size, teamsPage)

}

teamService.getTeam = async (teamId, user) => {

    const team = await Team.query()
    .findById(teamId)
    .modify('baseAttributes')
    .withGraphFetched('company(baseAttributes)')
    .withGraphFetched('teamIndustry(baseAttributes)')

    if (!team)
        throw new NotFoundError()

    const isInTeam = teamService.checkUserInTeam(teamId, user.sub);

    // const isPendingApply = teamService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.APPLY]);

    return Promise.all([isInTeam]).then(result => ({
        team: team,
        isInTeam: result[0] ? true : false,
        // isPendingApply: result[1] ? true : false
    }));

}

teamService.createTeam = async (teamDTO, user) => {

    return Team.transaction(async trx => {

        const team = await Team.query(trx)
            .insertToTable(teamDTO, user.sub);

        const teamUserMapping = await TeamUserMapping.query(trx)
            .insertToTable({
                eusereuserid: user.sub,
                eteameteamid: team.eteamid,
                eteamusermappingposition: TeamUserMappingPositionEnum.ADMIN
            }, user.sub);

        return Promise.resolve({ team, teamUserMapping });

    });

}

teamService.updateTeam = async (teamDTO, user, teamId) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    const team = await teamService.getTeamById(teamId);

    if (!team)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)

    return team.$query()
        .updateByUserId(teamDTO, user.sub)
        .returning('*');

}

teamService.checkUserInTeam = async (teamId, userId) => {

    return TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', userId)
    .first();

}

teamService.updateTeamLog = async (teamId, user, userId, status) => {

    const log = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    if (log) {
        return log.$query().updateByUserId({
            eteamlogstatus: status
        }, user.sub)
        .returning('*');
    }

}

teamService.processIntoTeam = async (teamId, user, userId) => {

    const teamUserMappingPromise = TeamUserMapping.query().insertToTable({
        eusereuserid: userId,
        eteameteamid: teamId,
        eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
    }, user.sub);

    const teamLogPromise = teamService.updateTeamLog(teamId, user, userId, TeamLogStatusEnum.ACCEPTED);

    return Promise.all([teamUserMappingPromise, teamLogPromise]);

}

teamService.createTeamLog = async (teamId, user, userId, type) => {

    return TeamLog.query().insertToTable({
        eteameteamid: teamId,
        eusereuserid: userId,
        eteamlogtype: type
    }, user.sub);

}

teamService.getTeamMemberCount = async (teamId) => {

    const teamMemberCount = await TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .count()
    .first();

    return parseInt(teamMemberCount.count);
    
}

teamService.getTeamById = async (teamId) => {

    return Team.query()
    .findById(teamId)
    .then(team => {
        if (!team)
            throw NotFoundError()
        return team
    });

}

teamService.exitTeam = async (teamId, user) => {

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, user.sub);

    if (!userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_TEAM)

    const removeUser = await teamService.removeUserFromTeam(userInTeam);

    const teamMemberCount = await teamService.getTeamMemberCount(teamId);

    // If team has no member after user leaving
    if (teamMemberCount === 0) {
        await Team.query()
        .where('eteamid', teamId)
        .delete();
    }

    return removeUser

}

teamService.processRequest = async (teamLogId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    const pendingApply = await teamService.getPendingLog(teamLogId, [TeamLogTypeEnum.APPLY]);

    if (!pendingApply)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    if (status === TeamLogStatusEnum.REJECTED)
        return teamService.updateTeamLog(teamId, user, userId, TeamLogStatusEnum.REJECTED)

    if (status === TeamLogStatusEnum.ACCEPTED)
        return teamService.processIntoTeam(teamId, user, userId);

}

teamService.getTeamMemberList = async (teamId, user, page = 0, size = 10, type) => {

    let promised

    // Return members in team
    if (type === TeamLogTypeEnum.MEMBER) {
        promised = TeamUserMapping.query()
        .select('euserid', 'eusername', 'user.efileefileid', 'eteamusermappingposition')
        .leftJoinRelated('[user, team]')
        .where('eteamid', teamId)
        .page(page, size);
    } else if (TeamLogTypeEnum.APPLY !== type && TeamLogTypeEnum.INVITE !== type)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TYPE_UNACCEPTED)
    else {

        const isAdmin = await teamService.isAdmin(teamId, user.sub);

        if (!isAdmin)
            throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

        // return log by type (APPLY / INVITE)
        promised = TeamLog.query()
        .select('eusereuserid', 'user.eusername', 'user.efileefileid')
        .leftJoinRelated('user.file')
        .where('eteameteamid', teamId)
        .andWhere('eteamlogtype', type)
        .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING);

    }

    const membersPage = await promised.page(page, size);

    return ServiceHelper.toPageObj(page, size, membersPage)

}

teamService.removeUserFromTeam = async (userInTeam) => {

    return userInTeam.$query()
    .delete()
    .then(rowsAffected => rowsAffected === 1);

}

teamService.cancelRequest = async (teamId, user) => {

    const pendingApply = await teamService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.APPLY]);

    if (!pendingApply)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    return pendingApply.$query().delete();

}

teamService.getPendingTeamList = async (user, page, size, type) => {

    if (type !== TeamLogTypeEnum.APPLY && type !== TeamLogTypeEnum.INVITE)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TYPE_UNACCEPTED)

    const pendingTeamPage = 
    await TeamLog.query()
        .where('eusereuserid', user.sub)
        .andWhere('eteamlogtype', type)
        .modify('baseAttributes')
        .withGraphFetched('team(baseAttributes).teamIndustry(baseAttributes)')
        .page(page, size);

    return ServiceHelper.toPageObj(page, size, pendingTeamPage);

}

teamService.processInvitation = async (teamId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const pendingInvite = await teamService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.INVITE]);

    if (!pendingInvite)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    if (status === TeamLogStatusEnum.REJECTED)
        return teamService.updateTeamLog(teamId, user, user.sub, TeamLogStatusEnum.REJECTED)

    if (status === TeamLogStatusEnum.ACCEPTED)
        return teamService.processIntoTeam(teamId, user, user.sub);

}

module.exports = teamService;