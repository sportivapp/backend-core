const TeamUserMapping = require('../models/TeamUserMapping');
const Team = require('../models/Team');
const ServiceHelper = require('../helper/ServiceHelper');
const { raw } = require('objection');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const teamLogService = require('./mobileTeamLogService');
const teamUserService = require('./mobileTeamUserService');

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

teamService.getTeamById = async (teamId) => {

    return Team.query()
    .findById(teamId)
    .then(team => {
        if (!team)
            throw NotFoundError()
        return team
    });

}

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

    // return null instead not found, because it
    const isInTeam = teamUserService.checkTeamUserByTeamIdAndUserId(teamId, user.sub);

    const teamLog = teamLogService.getLogByTeamIdAndUserIdDefaultPending(teamId, user.sub);

    return Promise.all([isInTeam, teamLog]).then(result => ({
        team: team,
        isInTeam: result[0] ? true : false,
        isPendingApply: result[1] ? true : false
    }));

}

teamService.createTeam = async (teamDTO, user) => {

    return Team.transaction(async trx => {

        const team = await Team.query(trx)
            .insertToTable(teamDTO, user.sub);

        // const teamUserMapping = await teamUserService.joinTeam(team.eteamid, user.sub, user, 'ADMIN');
        const teamUserMapping = await TeamUserMapping.query(trx)
            .insertToTable({
                eusereuserid: user.sub,
                eteameteamid: team.eteamid,
                eteamusermappingposition: 'ADMIN'
            }, user.sub);

        return Promise.resolve({ team, teamUserMapping });

    });

}

teamService.updateTeam = async (teamId, teamDTO, user) => {

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    const team = await teamService.getTeamById(teamId);

    if (!team)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)

    return team.$query()
        .updateByUserId(teamDTO, user.sub)
        .returning('*');

}

teamService.deleteTeam = async (teamId, user) => {

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    const team = await teamService.getTeamById(teamId);

    return team.$query()
        .del()
        .then(rowsAffected => rowsAffected === 1);

}

teamService.applyTeam = async (teamId, user) => {

    const teamUser = await teamUserService.checkTeamUserByTeamIdAndUserId(teamId, user.sub);

    if (teamUser)
        throw new UnsupportedOperationError(ErrorEnum.USER_IN_TEAM);

    const team = await teamService.getTeamById(teamId);

    return teamLogService.applyTeam(teamId, user, team.eteamispublic);

}

module.exports = teamService;