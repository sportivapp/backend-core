const TeamUserMapping = require('../models/TeamUserMapping');
const Team = require('../models/Team');
const ServiceHelper = require('../helper/ServiceHelper');
const { raw } = require('objection');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const { UniqueViolationError } = require('objection');
const teamLogService = require('./mobileTeamLogService');
const teamUserService = require('./mobileTeamUserService');
const mobileTeamSportTypeRoleService = require('./mobileTeamSportTypeRoleService');
const AddressService = require('./addressService');
const companyUserMappingService = require('./companyUserMappingService');

const ErrorEnum = {
    USER_IN_TEAM: 'USER_IN_TEAM',
    TEAM_NOT_FOUND: 'TEAM_NOT_FOUND',
    NAME_ALREADY_TAKEN: 'NAME_ALREADY_TAKEN',
    UPDATE_FAILED: 'UPDATE_FAILED'

}

const TeamLogStatusEnum = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED'
}

const TeamLogTypeEnum = {
    APPLY: 'APPLY'
}

const teamService = {}

function isTeamNameUniqueErr(e) {

    if (!e.nativeError)
        return false;

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

teamService.getTeams = async (page, size, keyword, filter) => {

    const teamsPagePromise = Team.query()
    .modify('baseAttributes')
    .withGraphFetched('teamIndustry(baseAttributes)')
    .withGraphFetched('company(baseAttributes)')
    .whereRaw(`LOWER("eteamname") LIKE LOWER('%${keyword}%')`)

    if (filter.companyId)
        teamsPagePromise.where('ecompanyecompanyid', filter.companyId)

    return teamsPagePromise
        .page(page, size)
        .then(teamsPage => ServiceHelper.toPageObj(page, size, teamsPage));

}

teamService.getTeam = async (teamId, user) => {

    const team = await Team.query()
    .findById(teamId)
    .modify('baseAttributes')
    .withGraphFetched('company(baseAttributes)')
    .withGraphFetched('teamIndustry(baseAttributes)')
    .withGraphFetched('teamAddress(baseAttributes)')

    if (!team)
        throw new NotFoundError()

    let isInCompany = false;

    if (team.ecompanyecompanyid)
        isInCompany = await companyUserMappingService.checkCompanyUserByCompanyIdAndUserId(team.ecompanyecompanyid, user.sub)
        
    // return null instead not found, because it
    const isInTeam = teamUserService.getTeamUserByTeamIdAndUserId(teamId, user.sub)
        .catch(() => null);

    const teamLog = teamLogService.getLogByTeamIdAndUserIdDefaultPending(teamId, user.sub);

    return Promise.all([isInTeam, teamLog]).then(result => ({
        ...team,
        isInCompany: !!isInCompany,
        isInTeam: !!result[0],
        teamLog: !result[1] ? null : result[1]
    }));

}

teamService.createTeam = async (teamDTO, addressDTO, user) => {

    return Team.transaction(async trx => {

        const address = await AddressService.createAddress(addressDTO, user, trx);

        teamDTO.eaddresseaddressid = address.eaddressid;

        const team = await Team.query(trx)
            .insertToTable(teamDTO, user.sub);

        await teamUserService.initializeTeamAdmin(team.eteamid, user, trx);
        // await TeamUserMapping.query(trx)
        //     .insertToTable({
        //         eusereuserid: user.sub,
        //         eteameteamid: team.eteamid,
        //         eteamusermappingposition: 'ADMIN'
        //     }, user.sub);

        return Promise.resolve({ 
            ...team,
            address: address
        });

    })    
    .catch(e => {
        if (isTeamNameUniqueErr(e)) throw new UnsupportedOperationError(ErrorEnum.NAME_ALREADY_TAKEN)
        throw e
    })

}

teamService.updateTeam = async (teamId, teamDTO, addressDTO, user) => {

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    let team = await teamService.getTeamById(teamId)
    .then(team => {
        return team.$query()
        .withGraphFetched('teamIndustry(baseAttributes)')
    })

    if (!team)
        throw new UnsupportedOperationError(ErrorEnum.TEAM_NOT_FOUND)

    return team.$query()
        .updateByUserId(teamDTO, user.sub)
        .returning('*')
        .then(async newTeam => {

            if(!newTeam) throw new UnsupportedOperationError(ErrorEnum.UPDATE_FAILED)

            // if teamIndustry is changed, remove all sportroles in team
            if(newTeam.eindustryeindustryid !== team.teamIndustry.eindustryid) 
                await mobileTeamSportTypeRoleService.deleteAllTeamSportTypeRolesByTeamId(teamId)
    
            // to check if the log in team exist
            await teamLogService.getPendingLogByTeamIdAndTypeAndStatus(teamId, TeamLogTypeEnum.APPLY, 0, 10, TeamLogStatusEnum.PENDING)
            .then(async applyPendingLog => {

                if(applyPendingLog.results.length !== 0){

                    // accept all user log that is applying to this team with pending status
                    if(newTeam.eteamispublic) await teamLogService.updateAppliedTeamLogsWithPendingByTeamIdAndStatus(teamId, user, TeamLogStatusEnum.ACCEPTED)

                }

            })

            const address = await AddressService.updateAddress(team.eaddresseaddressid, addressDTO, user);
            
            return { 
                ...newTeam, 
                address: address
            }
        })
        .catch(e => {
            if (isTeamNameUniqueErr(e)) throw new UnsupportedOperationError(ErrorEnum.NAME_ALREADY_TAKEN)
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

    const teamIds = await teamUserService.getTeamIdsByUserId(user.sub);

    return Team.query()
        .modify('baseAttributes')
        .withGraphFetched('teamIndustry(baseAttributes)')
        .withGraphFetched('company(baseAttributes)')
        .whereRaw(`LOWER("eteamname") LIKE LOWER('%${keyword}%')`)
        .whereIn('eteamid', teamIds)
        .page(page, size)
        .then(teams => ServiceHelper.toPageObj(page, size, teams));

}

module.exports = teamService;