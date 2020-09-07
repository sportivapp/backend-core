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
    UPDATE_FAILED: 'UPDATE_FAILED',
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

const TeamLogTypeEnum = {
    APPLY: 'APPLY',
    INVITE: 'INVITE',
    MEMBER: 'MEMBER'
}

const TeamLogStatusEnum = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
}

const TeamUserMappingPositionEnum = {
    ADMIN: 'ADMIN',
    MEMBER: 'MEMBER'
}

teamService.isAdmin = async (teamId, userId) => {
    return TeamUserMapping.query()
    .where('eusereuserid', userId)
    .andWhere('eteameteamid', teamId)
    .andWhere('eteamusermappingposition', TeamUserMappingPositionEnum.ADMIN)
    .first()
    .then(user => {
        return user.eteamusermappingposition === TeamUserMappingPositionEnum.ADMIN
    });
}

teamService.getPendingLog = async (teamId, userId, types) => {

    return TeamLog.query()
    .where('eusereuserid', userId)
    .andWhere('eteameteamid', teamId)
    .whereIn('eteamlogtype', types)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
    .orderBy('eteamlogcreatetime', 'DESC')
    .first();

}

teamService.getTeams = async (keyword, page = 0, size = 10) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    const teamsPage = await Team.query()
    .select('eteamid', 'eteam.efileefileid', 'eteamname', 'ecompanyname')
    .leftJoinRelated('company')
    .where(raw('lower("eteamname")'), 'like', `%${newKeyword}%`)
    .page(page, size);

    return ServiceHelper.toPageObj(page, size, teamsPage)

}

teamService.getTeam = async (teamId, user) => {

    const team = await Team.query()
    .select('eteamid', 'eteam.efileefileid', 'eteamname', 'ecompanyname', 'eteamdescription')
    .leftJoinRelated('company')
    .where('eteamid', teamId)
    .first();

    if (!team)
        throw new NotFoundError()

    const teamIndustries = TeamIndustryMapping.query()
    .select('eindustryid', 'eindustryname')
    .joinRelated('industry')
    .where('eteameteamid', team.eteamid);

    const isInTeam = TeamUserMapping.query()
    .where('eteameteamid', team.eteamid)
    .andWhere('eusereuserid', user.sub)
    .first();

    const isPendingApply = TeamLog.query()
    .where('eteameteamid', team.eteamid)
    .andWhere('eusereuserid', user.sub)
    .andWhere('eteamlogtype', TeamLogTypeEnum.APPLY)
    .first();

    return Promise.all([teamIndustries, isInTeam, isPendingApply]).then(result => ({
        team: team,
        teamIndustries: result[0],
        isInTeam: result[1] ? true : false,
        isPendingApply: result[2] ? true : false
    }));

}

teamService.createTeam = async (teamDTO, user, industryIds) => {

    const team = await Team.query().insertToTable(teamDTO, user.sub);

    const teamUserMappingPromise =  TeamUserMapping.query().insertToTable({
        eusereuserid: user.sub,
        eteameteamid: team.eteamid,
        eteamusermappingposition: TeamUserMappingPositionEnum.ADMIN
    }, user.sub);

    const teamIndustryMapping = industryIds.map(industryId => {
        return {
            eindustryeindustryid: industryId,
            eteameteamid: team.eteamid
        }
    });

    const teamIndustryMappingPromise = TeamIndustryMapping.query().insertToTable(teamIndustryMapping, user.sub);

    await Promise.all([teamUserMappingPromise, teamIndustryMappingPromise]);

    return team;

}

teamService.updateTeam = async (teamDTO, user, teamId, industryIds) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    const newTeam = await Team.query().updateByUserId(teamDTO, user.sub);

    if (!newTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.UPDATE_FAILED)

    // remove all industry mapping from the team
    await TeamIndustryMapping.query().where('eteameteamid', teamId).delete();

    const teamIndustryMapping = industryIds.map(industryId => {
        return {
            eindustryeindustryid: industryId,
            eteameteamid: teamId
        }
    });

    // insert new industry mapping to team
    await TeamIndustryMapping.query().insertToTable(teamIndustryMapping, user.sub);

    return newTeam;

}

teamService.checkUserInTeam = async (teamId, userId) => {

    return TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', userId)
    .first();

}

teamService.updateTeamLog = async (teamId, user, userId, status) => {

    const log = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    return log.$query().updateByUserId({
        eteamlogstatus: status
    }, user.sub)
    .returning('*');

}

teamService.processIntoTeam = async (teamId, user, userId) => {

    const teamUserMappingPromise = TeamUserMapping.query().insertToTable({
        eusereuserid: userId,
        eteameteamid: teamId,
        eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
    }, user.sub);

    const teamLogPromise = teamService.updateTeamLog(teamId, user, userId, TeamLogStatusEnum.ACCEPTED);

    return Promise.all([teamUserMappingPromise, teamLogPromise])
    .then();

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

teamService.joinTeam = async (teamId, user) => {

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, user.sub);

    if (userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_TEAM)

    // Check if this user already invited / applied
    const pendingInviteApply = await teamService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    // If there is no pending invite / apply, create apply log
    if (!pendingInviteApply)
        return teamService.createTeamLog(teamId, user, user.sub, TeamLogTypeEnum.APPLY);

    // If apply pending exist, return
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.APPLY && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_APPLIED)

    // If invited, then auto join
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.INVITE && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        return teamService.processIntoTeam(teamId, user, user.sub);

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

teamService.cancelInvite = async (teamId, userId, user) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)
    
    const pendingInvite = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.INVITE]);

    if (!pendingInvite)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    return pendingInvite.$query().delete();

}

teamService.processRequest = async (teamId, userId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    const pendingApply = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.APPLY]);

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

teamService.invite = async (teamId, user, email) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    const invitedUser = await User.query()
    .where('euseremail', email)
    .first();

    if (!invitedUser)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    const userInTeam = await teamService.checkUserInTeam(teamId, invitedUser.euserid);

    if (userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_TEAM)

    // Check if this user already invited / applied
    const pendingInviteApply = await teamService.getPendingLog(teamId, invitedUser.euserid, 
        [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    // If there is no pending log then create log and return
    if (!pendingInviteApply)
        return teamService.createTeamLog(teamId, user, invitedUser.euserid, TeamLogTypeEnum.INVITE)

    // If double invite, return
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.INVITE && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_INVITED)

    // If applied, auto join
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.APPLY && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        return teamService.processIntoTeam(teamId, user, invitedUser.euserid);
    
}

teamService.changeTeamMemberPosition = async (teamId, user, userId, position) => {

    if (user.sub === userId)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    if (!TeamUserMappingPositionEnum.hasOwnProperty(position))
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.POSITION_UNACCEPTED)

    return TeamUserMapping.query()
    .where('eusereuserid', userId)
    .andWhere('eteameteamid', teamId)
    .updateByUserId({ eteamusermappingposition: position }, user.sub);

}

teamService.kick = async (teamId, user, userId) => {

    if (user.sub === userId)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, userId);

    if (!userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_TEAM)

    return teamService.removeUserFromTeam(userInTeam);

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