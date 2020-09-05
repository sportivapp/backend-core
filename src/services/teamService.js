const Team = require('../models/Team')
const TeamUserMapping = require('../models/TeamUserMapping')
const TeamLog = require('../models/TeamLog')
const User = require('../models/User')
const TeamIndustryMapping = require('../models/TeamIndustryMapping')
const ServiceHelper = require('../helper/ServiceHelper');
const { raw } = require('objection');
const { toLower } = require('lodash')

const teamService = {}


const TeamLogStatusEnum = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
}

const TeamLogTypeEnum = {
    APPLY: 'APPLY',
    INVITE: 'INVITE',
    MEMBER: 'MEMBER'
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
    })
}

teamService.isUserInCompany = async (teamId, user) => {
    return Team.query()
    .where('eteamid', teamId)
    .first()
    .then(team => {
        return team.ecompanyecompanyid === user.companyId;
    });
}

teamService.createTeam = async (teamDTO, user, industryIds) => {

    const team = await Team.query().insertToTable(teamDTO, user.sub)
    
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

    return team

}

teamService.getTeams = async (keyword, page = 0, size = 10, user) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase();

    const teamsPage = await Team.query()
    .select('eteamid', 'ecompanyecompanyid', 'efileefileid', 'eteamname', 'eteamcreatetime', 
    Team.relatedQuery('members').count().as('membersCount'))
    .withGraphJoined('industries(selectName)')
    .where('ecompanyecompanyid', user.companyId)
    .where(raw('lower("eteamname")'), 'like', `%${newKeyword}%`)
    .page(page, size);

    return ServiceHelper.toPageObj(page, size, teamsPage)
}

teamService.getTeamDetail = async (teamId, user) => {

    const isUserCompany = await teamService.isUserInCompany(teamId, user);

    if (!isUserCompany)
        return 'unauthorized'

    const team = await Team.query()
    .select('eteamname', 'eteamdescription', 'efileefileid')
    .where('ecompanyecompanyid', user.companyId)
    .where('eteamid', teamId)
    .first()

    if (!team)
        return

    const industry = await TeamIndustryMapping.query()
    .select('industry.eindustryname')
    .leftJoinRelated('industry')
    .where('eteameteamid', teamId);

    return {
        team,
        industry
    }

}

teamService.getTeamMemberList = async (teamId, user, page = 0, size = 10, type) => {

    const isUserCompany = await teamService.isUserInCompany(teamId, user);

    if (!isUserCompany)
        return 'unauthorized'

    let promised

    // Return members in team
    if (type === TeamLogTypeEnum.MEMBER) {
        promised = TeamUserMapping.query()
        .select('euserid', 'eusername', 'user.efileefileid', 'eteamusermappingposition')
        .leftJoinRelated('[user, team]')
        .where('eteamid', teamId)
        .page(page, size);
    } else if (TeamLogTypeEnum.APPLY !== type && TeamLogTypeEnum.INVITE !== type)
        return 'type unaccepted'
    else {

        const isAdmin = await teamService.isAdmin(teamId, user.sub);

        if (!isAdmin)
            return 'not admin'

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

teamService.checkUserInTeamByUserIds = async (teamId, userIds) => {

    return TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .whereIn('eusereuserid', userIds)

}

teamService.checkUserInTeam = async (teamId, userId) => {

    return TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .andWhere('eusereuserid', userId)
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

teamService.getPendingLogByUserIds = async (teamId, userIds, types) => {

    return TeamLog.query()
    .whereIn('eusereuserid', userIds)
    .andWhere('eteameteamid', teamId)
    .whereIn('eteamlogtype', types)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
    .orderBy('eteamlogcreatetime', 'DESC')

}

teamService.createTeamLog = async (teamId, user, userId, type) => {

    return TeamLog.query().insertToTable({
        eteameteamid: teamId,
        eusereuserid: userId,
        eteamlogtype: type
    }, user.sub);

}

teamService.createTeamLogByUserIds = async (teamId, user, userIds, type) => {

    const logDTOs = userIds.map(userId => ({
        eteameteamid: teamId,
        eusereuserid: userId,
        eteamlogtype: type
    }))

    return TeamLog.query().insertToTable(logDTOs, user.sub);

}

teamService.updateTeamLog = async (teamId, user, userId, status) => {

    const log = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    return log.$query().updateByUserId({
        eteamlogstatus: status
    }, user.sub)
    .returning('*');

}

teamService.updateTeamLogByUserIds = async (teamId, user, userIds, status) => {

    await teamService.getPendingLogByUserIds(teamId, userIds, [TeamLogTypeEnum.APPLY]);

    return TeamLog.query()
    .whereIn('eusereuserid', userIds)
    .where('eteameteamid', teamId)
    .updateByUserId({
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

}

teamService.processIntoTeamByUserIds = async (teamId, user, appliedUsers) => {

    if(appliedUsers.length <= 0) {
        return
    }
    
    const userIds = appliedUsers.map(appliedUser => {
        return appliedUser.eusereuserid
    })

    const mapping = userIds.map(userId => (
        {
            eusereuserid: userId,
            eteameteamid: teamId,
            eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
        }
    ))

    const teamUserMappingPromise = TeamUserMapping.query().insertToTable(mapping, user.sub);

    const teamLogPromise = teamService.updateTeamLogByUserIds(teamId, user, userIds, TeamLogStatusEnum.ACCEPTED);

    return Promise.all([teamUserMappingPromise, teamLogPromise])
    .then(arr => {
        return arr[0]
    })

}

teamService.invite = async (teamId, user, userIds) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    const invitedUser = await User.query()
        .whereIn('euserid', userIds)

    if (!invitedUser)
        return 'user does not exist'

        const userInTeam = await teamService.checkUserInTeamByUserIds(teamId, userIds);

        if (userInTeam.length > 0)
            return 'one or more user already in team'
        
        // Check if this user already invited / applied
        const pendingInviteApply = await teamService.getPendingLogByUserIds(teamId, userIds, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

        const removedElement = (array, elem) => {
            let index = array.indexOf(elem);
            if (index > -1) {
                array.splice(index, 1);
            }
        }

        let invitedUserIds = userIds
        let userApplyList = await teamService.getPendingLogByUserIds(teamId, userIds, [TeamLogTypeEnum.APPLY]);


        if(pendingInviteApply.length > 0) {
            // take the user that havent been log into team log, also taking user that has PENDING and already APPLY
            
            pendingInviteApply.forEach(loggedUser => {
                userIds.forEach(userId => {
                    if(loggedUser.eusereuserid === userId)
                        removedElement(invitedUserIds, userId)
                })
            })
        }

        let invited
        let applied

        if(invitedUserIds.length > 0)
            invited = await teamService.createTeamLogByUserIds(teamId, user, invitedUserIds, TeamLogTypeEnum.INVITE)

        if(userApplyList.length > 0) 
            applied = await teamService.processIntoTeamByUserIds(teamId, user, userApplyList);

        //if no apply log and no invite log need to be created
        if(invitedUserIds.length <= 0 && userApplyList.length <= 0) {
            return "users already invited"
        }

        const result = {
            invitedUsers: invited,
            appliedUsers: applied
        }

        return result

}

teamService.processRequest = async (teamId, userId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        return 'status unaccepted'

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    const pendingApply = await teamService.getPendingLog(teamId, userId, [TeamLogTypeEnum.APPLY]);

    if (!pendingApply)
        return 'no apply'

    if (status === TeamLogStatusEnum.REJECTED)
        return teamService.updateTeamLog(teamId, user, userId, TeamLogStatusEnum.REJECTED)

    if (status === TeamLogStatusEnum.ACCEPTED)
        return teamService.processIntoTeam(teamId, user, userId);

}

teamService.processInvitation = async (teamId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        return 'status unaccepted'

    const pendingInvite = await teamService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.INVITE]);

    if (!pendingInvite)
        return 'no invitation'

    if (status === TeamLogStatusEnum.REJECTED)
        return teamService.updateTeamLog(teamId, user, user.sub, TeamLogStatusEnum.REJECTED)

    if (status === TeamLogStatusEnum.ACCEPTED)
        return teamService.processIntoTeam(teamId, user, user.sub);

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
        return teamService.createTeamLog(teamId, user, user.sub, TeamLogTypeEnum.APPLY);

    // If apply pending exist, return
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.APPLY && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        return 'user already applied'

    // If invited, then auto join
    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.INVITE && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING)
        return teamService.processIntoTeam(teamId, user, user.sub);

}

teamService.removeUserFromTeam = async (userInTeam) => {

    return userInTeam.$query()
    .delete()
    .then(rowsAffected => rowsAffected === 1);

}

teamService.kick = async (teamId, user, userId) => {

    if (user.sub === userId)
        return 'cannot kick yourself'

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, userId);

    if (!userInTeam)
        return 'user not in team'

    return teamService.removeUserFromTeam(userInTeam);

}

teamService.changeTeamMemberPosition = async (teamId, user, userId, position) => {

    if (user.sub === userId)
        return 'cannot change your position'

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        return 'not admin'

    if (!TeamUserMappingPositionEnum.hasOwnProperty(position))
        return 'position unaccepted'

    await TeamUserMapping.query()
    .where('eusereuserid', userId)
    .updateByUserId({ eteamusermappingposition: position }, user.sub);

}

module.exports = teamService