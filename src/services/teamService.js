const Team = require('../models/Team')
const TeamUserMapping = require('../models/TeamUserMapping')
const User = require('../models/User')
const TeamIndustryMapping = require('../models/TeamIndustryMapping')
const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const { raw } = require('objection');
const teamLogService = require('./teamLogService')

const teamService = {}

const UnsupportedOperationErrorEnum = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    NOT_ADMIN: 'NOT_ADMIN',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM',
    UPDATE_FAILED: 'UPDATE_FAILED',
    USER_APPLIED: 'USER_APPLIED',
    USER_IN_TEAM: 'USER_IN_TEAM',
    USER_ALREADY_INVITED: 'USER_ALREADY_INVITED',
    USER_NOT_INVITED: 'USER_NOT_INVITED',
    STATUS_UNACCEPTED: 'STATUS_UNACCEPTED',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    TYPE_UNACCEPTED: 'TYPE_UNACCEPTED',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    POSITION_UNACCEPTED: 'POSITION_UNACCEPTED',
    INDUSTRY_NOT_FILLED: 'INDUSTRY_NOT_FILLED',
    TEAM_NOT_FOUND: 'TEAM_NOT_FOUND',
    FAILED_TO_REQUEST_JOIN: 'FAILED_TO_REQUEST_JOIN'

}

const TeamLogStatusEnum = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    KICKED: 'KICKED'
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
        if(!user) return false
        return user.eteamusermappingposition === TeamUserMappingPositionEnum.ADMIN
    })
}

teamService.isUserInCompany = async (teamId, user) => {
    return Team.query()
    .where('eteamid', teamId)
    .first()
    .then(team => {
        if(!team) return false
        return team.ecompanyecompanyid === user.companyId;
    });
}

teamService.getTeamMemberCount = async (teamId) => {

    const teamMemberCount = await TeamUserMapping.query()
    .where('eteameteamid', teamId)
    .count()
    .first();

    return parseInt(teamMemberCount.count);
    
}

teamService.createTeam = async (teamDTO, user) => {

    return Team.transaction(async trx => {

        const team = await Team.query(trx).insertToTable(teamDTO, user.sub)
        
        const teamUserMapping =  await TeamUserMapping.query(trx).insertToTable({
            eusereuserid: user.sub,
            eteameteamid: team.eteamid,
            eteamusermappingposition: TeamUserMappingPositionEnum.ADMIN
        }, user.sub);

        return Promise.resolve({ team, teamUserMapping })

    })

}

teamService.updateTeam = async (teamDTO, user, teamId) => {

    const teamFromDB = await Team.query()
    .findById(teamId)
    .then(team => {
        if(!team) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)
        return team
    })

    const isAdmin = await teamService.isAdmin(teamId, user.sub)
    
    if(!isAdmin) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    return teamFromDB.$query()
        .updateByUserId(teamDTO, user.sub)
        .returning('*')
        .then(newTeam => {
            if(!newTeam) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.UPDATE_FAILED)
            return newTeam
        })
}

teamService.getTeams = async (keyword, page, size, user) => {

    return Team.query()
    .where('ecompanyecompanyid', user.companyId)
    .modify('baseAttributes')
    .withGraphFetched('company(baseAttributes)')
    .where(raw('lower("eteamname")'), 'like', `%${keyword}%`)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

teamService.getTeamDetail = async (teamId, user) => {

    const userInCompany = await teamService.isUserInCompany(teamId, user)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    const team = await Team.query()
    .modify('baseAttributes')
    .findById(teamId)
    .where('ecompanyecompanyid', user.companyId)
    .then(team => {
        if (!team) throw new NotFoundError()
        return team
    })

    const count = await teamService.getTeamMemberCount(teamId)

    return {
        ...team,
        count
    }

}

teamService.getTeamMemberList = async (teamId, user, page, size) => {

    // check if team exist
    await Team.query()
    .findById(teamId)
    .then(team => {
        if (!team) throw new NotFoundError()
        return team
    })

    // check if user in company
    const userInCompany = await teamService.isUserInCompany(teamId, user)
    
    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    return TeamUserMapping.query()
    .select('euserid', 'eusername', 'user.efileefileid', 'eteamusermappingposition')
    .leftJoinRelated('[user, team]')
    .where('eteamid', teamId)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

teamService.getTeamMemberByLogType = async (teamId, user, page, size, type) => {

    // check if team exist
    await Team.query()
    .findById(teamId)
    .then(team => {
        if (!team) throw new NotFoundError()
        return team
    })

    // check if user in company
    const userInCompany = await teamService.isUserInCompany(teamId, user)
    
    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    if (TeamLogTypeEnum.APPLY !== type && TeamLogTypeEnum.INVITE !== type)

        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TYPE_UNACCEPTED)

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    return teamLogService.getPendingLogByType(teamId, type, page, size, TeamLogStatusEnum.PENDING)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

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

teamService.processIntoTeam = async (teamId, user, userId) => {

    const teamUserMappingPromise = TeamUserMapping.query().insertToTable({
        eusereuserid: userId,
        eteameteamid: teamId,
        eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
    }, user.sub);

    const teamLogPromise = teamLogService.updateTeamLog(teamId, user, userId, TeamLogStatusEnum.ACCEPTED);

    return Promise.all([teamUserMappingPromise, teamLogPromise])

}

teamService.processIntoTeamByUserIds = async (teamId, user, appliedUsers) => {

    if(appliedUsers.length <= 0) {
        return
    }
    
    let userIds = [];

    const mapping = appliedUsers.map(appliedUser => {

        userIds.push(appliedUser.eusereuserid);

        return {
            eusereuserid: appliedUser.eusereuserid,
            eteameteamid: teamId,
            eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
        }
    })

    const teamUserMappingPromise = TeamUserMapping.query().insertToTable(mapping, user.sub);

    const teamLogPromise = teamLogService.updateTeamLogByUserIds(teamId, user, userIds, TeamLogStatusEnum.ACCEPTED);

    return Promise.all([teamUserMappingPromise, teamLogPromise])
    .then(arr => {
        return arr[0]
    })

}

teamService.invite = async (teamId, user, userIds) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub)
    
    if(!isAdmin) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    const invitedUsers = await User.query()
        .whereIn('euserid', userIds)

    if (invitedUsers.length !== userIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    const userInTeam = await teamService.checkUserInTeamByUserIds(teamId, userIds);

    if (userInTeam.length > 0)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_TEAM)
    
    // Check if this user already invited / applied
    const pendingInviteApply = await teamLogService.getPendingLogByUserIds(teamId, userIds, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    const removedElement = (array, elem) => {
        let index = array.indexOf(elem);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    let invitedUserIds = userIds
    let userApplyList = await teamLogService.getPendingLogByUserIds(teamId, userIds, [TeamLogTypeEnum.APPLY]);


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
        invited = await teamLogService.createTeamLogByUserIds(teamId, user, invitedUserIds, TeamLogTypeEnum.INVITE)

    if(userApplyList.length > 0) 
        applied = await teamService.processIntoTeamByUserIds(teamId, user, userApplyList);

    //if no apply log and no invite log need to be created
    if(invitedUserIds.length <= 0 && userApplyList.length <= 0) {
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_TEAM)
    }

    const result = {
        invitedUsers: invited,
        appliedUsers: applied
    }

    return result

}

teamService.cancelInvite = async (teamId, userId, user) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)
    
    const pendingInvite = await teamLogService.getPendingLog(teamId, userId, [TeamLogTypeEnum.INVITE]);

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

    const pendingApply = await teamLogService.getPendingLog(teamId, userId, [TeamLogTypeEnum.APPLY]);

    if (!pendingApply)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    if (status === TeamLogStatusEnum.REJECTED)
        return teamLogService.updateTeamLog(teamId, user, userId, TeamLogStatusEnum.REJECTED)

    if (status === TeamLogStatusEnum.ACCEPTED)
        return teamService.processIntoTeam(teamId, user, userId);

}

teamService.cancelRequest = async (teamId, user) => {

    const pendingApply = await teamLogService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.APPLY]);

    if (!pendingApply)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    return pendingApply.$query().delete();

}

teamService.processInvitation = async (teamId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const pendingInvite = await teamLogService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.INVITE]);

    if (!pendingInvite)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    if (status === TeamLogStatusEnum.REJECTED)
        return teamLogService.updateTeamLog(teamId, user, user.sub, TeamLogStatusEnum.REJECTED)

    if (status === TeamLogStatusEnum.ACCEPTED)
        return teamService.processIntoTeam(teamId, user, user.sub);

}

teamService.joinTeam = async (teamId, user) => {

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, user.sub);

    if (userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_TEAM)

    const getTeam = await teamService.getTeamDetail(teamId, user)
    .catch(() => null)

    if(!getTeam) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)

    // Check if this user already invited / applied
    const pendingInviteApply = await teamLogService.getPendingLog(teamId, user.sub, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    // If there is no pending invite / apply, create apply log
    if (!pendingInviteApply) {

        const createTeamLog = await teamLogService.createTeamLog(teamId, user, user.sub, TeamLogTypeEnum.APPLY)

        // if That team that wants to be joined is public ( eteamispublic === true), process into team immediately
        if(getTeam.eteamispublic)
            return teamService.processIntoTeam(teamId, user, user.sub);

        return createTeamLog

    // If apply pending exist
    } else if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.APPLY && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING) {

        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_APPLIED)

    }

    if (pendingInviteApply.eteamlogtype === TeamLogTypeEnum.INVITE && pendingInviteApply.eteamlogstatus === TeamLogStatusEnum.PENDING) {

        return teamService.processIntoTeam(teamId, user, user.sub);

    }

    // just to make it safe
    throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FAILED_TO_REQUEST_JOIN)

}

teamService.exitTeam = async (teamId, user) => {

    // if team exist
    await Team.query()
    .findById(teamId)
    .then(team => {
        if(!team) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)
    })

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, user.sub);

    if (!userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_TEAM)

    // keep other undefined because not used
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

teamService.removeUserFromTeam = async (userInTeam, user, userId, type, logMessage) => {

    return TeamUserMapping.transaction(async trx => {

        // if user kicked
        if(type === TeamLogStatusEnum.KICKED) {
            await teamLogService.updateKickedTeamLog(userInTeam.eteameteamid, user, userId, logMessage, trx)
        }

        return userInTeam.$query(trx)
        .delete()
        .then(rowsAffected => rowsAffected === 1);

    })

}

teamService.kickUserFromTeam = async (teamId, user, userId, logMessage) => {

    // if team exist
    await Team.query()
    .findById(teamId)
    .then(team => {
        if(!team) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)
    })

    if (user.sub === userId)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    const isAdmin = await teamService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    // If user already in team
    const userInTeam = await teamService.checkUserInTeam(teamId, userId);

    if (!userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_TEAM)

    return teamService.removeUserFromTeam(userInTeam, user, userId, TeamLogStatusEnum.KICKED, logMessage);

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
    .where('eteameteamid', teamId)
    .updateByUserId({ eteamusermappingposition: position }, user.sub);

}

teamService.getMembersToInvite = async (teamId, user, page, size) => {

    let existUserIds = [];

    if (teamId) {
        const users = await TeamUserMapping.query().select('eusereuserid');
        existUserIds = users.map(user => user.eusereuserid);
    }

    const usersPage = await User.query()
    .select('euser.efileefileid', 'euserid', 'eusername')
    .joinRelated('companies')
    .where('ecompanyid', user.companyId)
    .whereNotIn('euserid', existUserIds)
    .modify({ ecompanyusermappingdeletestatus: false })
    .page(page, size);

    return ServiceHelper.toPageObj(page, size, usersPage)

}

teamService.deleteTeam = async (teamId, user) => {

    const isAdmin = await teamService.isAdmin(teamId, user.sub)

    if(!isAdmin) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    return Team.query()
    .findById(teamId)
    .delete()
    .then(rowsAffected => rowsAffected === 1)
}

module.exports = teamService