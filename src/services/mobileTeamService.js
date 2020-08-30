const TeamUserMapping = require('../models/TeamUserMapping');
const TeamLog = require('../models/TeamLog');
const Team = require('../models/Team');
const User = require('../models/User');
const ServiceHelper = require('../helper/ServiceHelper');
const { raw } = require('objection');

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
    .first();
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

teamService.getTeams = async (keyword, page, size) => {

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

    const team = TeamUserMapping.query()
    .select('eteamid', 'team.efileefileid', 'eteamname', 'ecompanyname', 'eteamaddress', 'eteamphonenumber', 'eteamemail')
    .leftJoinRelated('team.company')
    .where('eteameteamid', teamId)
    .first();

    if (!team)
        return

    const isInTeam = TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', user.sub)
    .first();

    const isPendingApply = TeamLog.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', user.sub)
    .andWhere('eteamlogtype', TeamLogTypeEnum.APPLY)
    .first();

    return Promise.all([team, isInTeam, isPendingApply]).then(result => ({
        team: result[0],
        isInTeam: result[1] ? true : false,
        isPendingApply: result[2] ? true : false
    }));

}

teamService.createTeam = async (teamDTO, user) => {

    const team = await Team.query().insertToTable(teamDTO, user.sub);

    if (!team)
        return

    await TeamUserMapping.query().insertToTable({
        eusereuserid: user.sub,
        eteameteamid: team.eteamid,
        eteamusermappingposition: TeamUserMappingPositionEnum.ADMIN
    }, user.sub);

    return team;

}

teamService.checkUserInTeam = async (teamId, userId) => {

    return TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', userId)
    .first();

}

teamService.updateTeamLog = async (teamId, user, userId, status) => {

    const log = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    await log.$query().updateByUserId({
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

teamService.joinTeam = async (teamId, user) => {

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, user.sub);

    if (userInTeam)
        return 'user already in team'

    // Check if this user already invited / applied
    const pendingInviteApply = await teamService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    // If there is no pending invite / apply, create apply log
    if (!pendingInviteApply)
        teamService.createTeamLog(teamId, user, user.sub, TeamLogTypeEnum.APPLY);

    // If apply pending exist, return
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.APPLY && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        return 'user already applied'

    // If invited, then auto join
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.INVITE && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        return teamService.processIntoTeam(teamId, user, user.sub);

}

teamService.exitTeam = async (teamId, user) => {

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, user.sub);

    if (!userInTeam)
        return 'user not in team'

    return teamService.removeUserFromTeam(userInTeam);

}

teamService.cancelInvite = async (teamId, userId, user) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'
    
    const pendingInvite = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.INVITE]);

    if (!pendingInvite)
        return 'user already invited'

    return pendingInvite.$query().delete();

}

teamService.processRequest = async (teamId, userId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        return 'status unaccepted'

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    const pendingApply = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.APPLY]);

    if (!pendingApply)
        return

    if (status === TeamLogStatusEnum.REJECTED)
        return teamService.updateTeamLog(teamId, user, userId, TeamLogStatusEnum.REJECTED)

    if (status === TeamLogStatusEnum.ACCEPTED)
        return teamService.processIntoTeam(teamId, user, userId);

}

teamService.getTeamMemberList = async (teamId, type) => {

    if (type !== TeamLogTypeEnum.MEMBER) {

        if (!TeamLogTypeEnum[type].hasOwnProperty(type))
            return 'type unaccepted'

        return TeamLog.query()
        .select('eusereuserid', 'eusername', 'euser.efileefileid')
        .leftJoinRelated('user.file')
        .where('eteameteamid', teamId)
        .andWhere('eteamlogtype', type)
        .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING);

    } else if (type === TeamLogTypeEnum.MEMBER) {
        return Team.query()
        .select('eusereuserid', 'eusername', 'euser.efileefileid', 'eteamusermappingposition')
        .leftJoinRelated('members.file')
        .where('eteamid', teamId)
    }

}

teamService.invite = async (teamId, user, email) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    const invitedUser = await User.query()
    .where('euseremail', email)
    .first();

    if (!invitedUser)
        return 'user does not exist'

    const userInTeam = await teamService.checkUserInTeam(teamId, invitedUser.euserid);

    if (userInTeam)
        return 'user already in team'

    // Check if this user already invited / applied
    const pendingInviteApply = await teamService.getPendingLog(teamId, invitedUser.euserid, 
        [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    // If there is no pending log then create log and return
    if (!pendingInviteApply)
        return teamService.createTeamLog(teamId, user, userId, TeamLogTypeEnum.INVITE)

    // If double invite, return
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.INVITE && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        return 'user already invited'

    // If applied, auto join
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.APPLY && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        return teamService.processIntoTeam(teamId, user, invitedUser.euserid);
    
}

teamService.changeTeamMemberPosition = async (teamId, user, userId, position) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    if (!TeamUserMappingPositionEnum.hasOwnProperty(position))
        return 'position unaccepted'

    await TeamUserMapping.query()
    .where('eusereuserid', userId)
    .updateByUserId({ eteamusermappingposition: position }, user.sub);

}

teamService.kick = async (teamId, user, userId) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, userId);

    if (!userInTeam)
        return 'user not in team'

    return teamService.removeUserFromTeam(userInTeam);

}

teamService.removeUserFromTeam = async (userInTeam) => {

    return userInTeam.$query()
    .delete()
    .then(rowsAffected => rowsAffected === 1);

}

module.exports = teamService;