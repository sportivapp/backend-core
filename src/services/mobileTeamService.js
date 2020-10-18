const TeamUserMapping = require('../models/TeamUserMapping');
const Team = require('../models/Team');
const ServiceHelper = require('../helper/ServiceHelper');
const { raw } = require('objection');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const { UniqueViolationError } = require('objection');
const teamLogService = require('./mobileTeamLogService');
const teamUserService = require('./mobileTeamUserService');

const ErrorEnum = {
    USER_IN_TEAM: 'USER_IN_TEAM',
    TEAM_NOT_FOUND: 'TEAM_NOT_FOUND'
}

const teamService = {}

const UnsupportedOperationErrorEnum = {
    NAME_ALREADY_TAKEN: 'NAME_ALREADY_TAKEN'

}

function isTeamNameUniqueErr(e) {

    return e.nativeError.detail.includes('eteamname') && e instanceof UniqueViolationError

}

teamService.getTeamById = async (teamId) => {

    return Team.query()
    .findById(teamId)
    .then(team => {
        if (!team)
            throw new NotFoundError()
        return team
    });

}

teamService.getTeams = async (page, size, keyword) => {

    const teamsPage = await Team.query()
    .modify('baseAttributes')
    .withGraphFetched('company(baseAttributes)')
    .whereRaw(`LOWER("eteamname") LIKE LOWER('%${keyword}%')`)
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
    const isInTeam = teamUserService.getTeamUserByTeamIdAndUserId(teamId, user.sub)
        .catch(() => null);

    const teamLog = teamLogService.getLogByTeamIdAndUserIdDefaultPending(teamId, user.sub);

    return Promise.all([isInTeam, teamLog]).then(result => ({
        ...team,
        isInTeam: !!result[0],
        teamLog: !result[1] ? null : result[1]
    }));

}

teamService.createTeam = async (teamDTO, user) => {

    return Team.transaction(async trx => {

        const team = await Team.query(trx)
            .insertToTable(teamDTO, user.sub);

        await teamUserService.initializeTeamAdmin(team.eteamid, user, trx);
        // await TeamUserMapping.query(trx)
        //     .insertToTable({
        //         eusereuserid: user.sub,
        //         eteameteamid: team.eteamid,
        //         eteamusermappingposition: 'ADMIN'
        //     }, user.sub);

        return Promise.resolve({ ...team });

    })    
    .catch(e => {
        if (isTeamNameUniqueErr(e)) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NAME_ALREADY_TAKEN)
        throw e
    })

}

teamService.updateTeam = async (teamId, teamDTO, user) => {

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    const team = await teamService.getTeamById(teamId);

    if (!team)
        throw new UnsupportedOperationError(ErrorEnum.TEAM_NOT_FOUND)

    return team.$query()
        .updateByUserId(teamDTO, user.sub)
        .returning('*')
        .catch(e => {
            if (isTeamNameUniqueErr(e)) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NAME_ALREADY_TAKEN)
            throw e
        })

}

teamService.deleteTeam = async (teamId, user) => {

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    const team = await teamService.getTeamById(teamId);

    return team.$query()
        .del()
        .then(rowsAffected => rowsAffected === 1);

}

teamService.applyTeam = async (teamId, user) => {

    const team = await teamService.getTeamById(teamId);

    return teamLogService.applyTeam(teamId, user, team.eteamispublic);

}

teamService.getMyTeams = async (page, size, keyword, user) => {

    const teamIds = await teamUserService.getTeamIdsByUser(user);

    return Team.query()
        .modify('baseAttributes')
        .withGraphFetched('company(baseAttributes)')
        .whereRaw(`LOWER("eteamname") LIKE LOWER('%${keyword}%')`)
        .whereIn('eteamid', teamIds)
        .page(page, size)
        .then(teams => ServiceHelper.toPageObj(page, size, teams));

}

module.exports = teamService;