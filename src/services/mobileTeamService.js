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

teamService.getPendingLog = async (teamId, userId, type) => {

    return TeamLog.query()
    .where('eusereuserid', userId)
    .andWhere('eteameteamid', teamId)
    .andWhere('eteamlogtype', type)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
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

    if (teamsPage.length === 0) 
        return ServiceHelper.toEmptyPage(page, size);

    return ServiceHelper.toPageObj(page, size, teamsPage)

}

teamService.getTeam = async (teamId, user) => {

    const team = TeamUserMapping.query()
    .select('eteamid', 'team.efileefileid', 'eteamname', 'ecompanyname', 'eteamaddress', 'eteamphonenumber', 'eteamemail')
    .leftJoinRelated('team.company')
    .where('eteameteamid', teamId)
    .first();

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

teamService.joinTeam = async (teamId, user) => {

    // Check if this user already invited / applied
    const pendingLog = await TeamLog.query()
    .where('eusereuserid', user.sub)
    .andWhere('eteameteamid', teamId)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
    .first();

    // If double apply, return
    if (pendingLog.eteamlogtype === TeamLogTypeEnum.APPLY)
        return

    // If invited, then auto join
    if (pendingLog.eteamlogtype === TeamLogTypeEnum.INVITE) {

        TeamUserMapping.query().insertToTable({
            eusereuserid: user.sub,
            eteameteamid: teamId,
            eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
        }, user.sub);

        return TeamLog.query().updateByUserId({
            eteamlogstatus: TeamLogStatusEnum.ACCEPTED
        }, user.sub).returning('*');

    }

    // If not then create an apply
    return TeamLog.query().insertToTable({
        eteameteamid: teamId,
        eusereuserid: user.sub,
        eteamlogtype: TeamLogTypeEnum.APPLY
    }, user.sub);

}

teamService.exitTeam = async (teamId, user) => {

    const userOnTeam = await TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', user.sub)
    .first();

    if (!userOnTeam)
        return

    return userOnTeam.$query().delete();

}

teamService.cancelInvite = async (teamId, userId, user) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'
    
    const pendingInvite = await teamService.getPendingLog(teamId, userId, TeamLogTypeEnum.INVITE);

    if (!pendingInvite)
        return

    return pendingInvite.$query().delete();

}

teamService.processRequest = async (teamId, userId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        return 'status unaccepted'

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    const pendingApply = await teamService.getPendingLog(teamId, userId, TeamLogTypeEnum.APPLY);

    if (!pendingApply)
        return

    if (status === TeamLogStatusEnum.ACCEPTED) {

        const teamUserMappingDTO = {
            eteameteamid: pendingApply.eteameteamid,
            eusereuserid: pendingApply.eusereuserid,
            eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
        }

        await TeamUserMapping.query().insertToTable(teamUserMappingDTO, user.sub);
    }

    return pendingApply.$query().updateByUserId({
        eteamlogstatus: status
    }, user.sub);

}

teamService.getTeamMemberList = async (teamId, type) => {

    if (type !== TeamLogTypeEnum.MEMBER) {

        if (!TeamLogTypeEnum[type].hasOwnProperty(type))
            return

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

    const invitedUser = await User.query().where('euseremail', email).first();

    if (!invitedUser)
        return

    const userInTeam = await TeamUserMapping.query().where('eusereuserid', invitedUser.euserid).andWhere('eteameteamid', teamId);

    if (userInTeam)
        return

    // Check if this user already invited / applied
    const pendingLog = await TeamLog.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', invitedUser.euserid);

    // If double invite, return
    if (pendingLog.eteamlogtype === TeamLogTypeEnum.INVITE)
        return

    // If applied, auto join
    if (pendingLog.eteamlogtype === TeamLogTypeEnum.APPLY) {

        TeamUserMapping.query().insertToTable({
            eusereuserid: invitedUser.euserid,
            eteameteamid: teamId,
            eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
        }, user.sub);

        return TeamLog.query().updateByUserId({
            eteamlogstatus: TeamLogStatusEnum.ACCEPTED
        }, user.sub).returning('*');

    }

    // If not then create an invite
    return TeamLog.query().insertToTable({
        eteameteamid: teamId,
        eusereuserid: invitedUser.euserid,
        eteamlogtype: TeamLogTypeEnum.INVITE
    }, user.sub);
    
}

teamService.changeTeamMemberPosition = async (teamId, user, userId, position) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    if (!TeamUserMappingPositionEnum.hasOwnProperty(position))
        return

    await TeamUserMapping.query()
    .where('eusereuserid', userId)
    .updateByUserId({ eteamusermappingposition: position }, user.sub);

}

teamService.kick = async (teamId, user, userId) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    await TeamUserMapping.query()
    .where('eusereuserid', userId)
    .delete();

}

module.exports = teamService;