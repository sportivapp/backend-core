const Team = require('../models/Team')
const TeamUserMapping = require('../models/TeamUserMapping')
const TeamLog = require('../models/TeamLog')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const { raw, UniqueViolationError } = require('objection');
const teamLogService = require('./teamLogService');
const teamUserMappingService = require('./teamUserMappingService')
const teamSportTypeRoleService = require('./teamSportTypeRoleService')
const fileService = require('./fileService')
const AddressService = require('./addressService')

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
    FAILED_TO_REQUEST_JOIN: 'FAILED_TO_REQUEST_JOIN',
    NAME_ALREADY_TAKEN: 'NAME_ALREADY_TAKEN',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND'

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

teamService.isUserInCompany = async (teamId, user) => {
    return Team.query()
    .where('eteamid', teamId)
    .first()
    .then(team => {
        if(!team) return false
        return team.ecompanyecompanyid === user.companyId;
    });
}

function isTeamNameUniqueErr(e) {

    if (!e.nativeError)
        return false;

    return e.nativeError.detail.includes('eteamname') && e instanceof UniqueViolationError

}

teamService.createTeam = async (teamDTO, addressDTO, user) => {

    if(teamDTO.efileefileid) {

        await fileService.getFileByIdAndCreateBy(teamDTO.efileefileid, user.sub)
        .then(file => {
            if(!file) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_FOUND)
        })

    }

    return Team.transaction(async trx => {

        const address = await AddressService.createAddress(addressDTO, user, trx);

        teamDTO.eaddresseaddressid = address.eaddressid;

        const team = await Team.query(trx).insertToTable(teamDTO, user.sub)
        
        const teamUserMapping =  await TeamUserMapping.query(trx).insertToTable({
            eusereuserid: user.sub,
            eteameteamid: team.eteamid,
            eteamusermappingposition: TeamUserMappingPositionEnum.ADMIN
        }, user.sub);

        return Promise.resolve({ team, teamUserMapping })

        
    })
    .catch(e => {
        if (isTeamNameUniqueErr(e)) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NAME_ALREADY_TAKEN)
        throw e
    })

}

teamService.updateTeam = async (teamId, teamDTO, addressDTO, user) => {

    if(teamDTO.efileefileid) {

        await fileService.getFileByIdAndCreateBy(teamDTO.efileefileid, user.sub)
        .then(file => {
            if(!file) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_FOUND)
        })

    }

    const teamFromDB = await teamService.getTeamDetail(teamId, user)
    .catch( () => null)

    if(!teamFromDB) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)

    const isAdmin = await teamUserMappingService.isAdmin(teamId, user.sub)
    
    if(!isAdmin) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    return teamFromDB.$query()
        .updateByUserId(teamDTO, user.sub)
        .returning('*')
        .then(async newTeam => {
            if(!newTeam) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.UPDATE_FAILED)

            // if teamIndustry is changed, remove all sportroles in team
            if(newTeam.eindustryeindustryid !== teamFromDB.teamIndustry.eindustryid) 
                await teamSportTypeRoleService.deleteAllTeamSportTypeRolesByTeamId(teamId)
    
            // to check if the log in team exist
            await teamLogService.getPendingLogByTeamIdAndTypeAndStatus(teamId, TeamLogTypeEnum.APPLY, 0, 10, TeamLogStatusEnum.PENDING)
            .then(async applyPendingLog => {

                if(applyPendingLog.results.length !== 0){

                    // accept all user log that is applying to this team with pending status
                    if(newTeam.eteamispublic) await teamLogService.updateAppliedTeamLogsWithPendingByTeamIdAndStatus(teamId, user, TeamLogStatusEnum.ACCEPTED)

                }

            })

            const address = await AddressService.updateAddress(teamFromDB.eaddresseaddressid, addressDTO, user);
            
            return { 
                ...newTeam,
                address: address
            }
        })
        .catch(e => {
            if (isTeamNameUniqueErr(e)) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NAME_ALREADY_TAKEN)
            throw e
        })
}

teamService.getMyTeamList = async (page, size, keyword, user) => {
    
    const teamIds = await teamUserMappingService.getTeamIdsByUser(user)

    return Team.query()
    .modify('baseAttributes')
    .withGraphFetched('company(baseAttributes)')
    .withGraphFetched('teamPicture(baseAttributes)')
    .withGraphFetched('teamIndustry(baseAttributes)')
    .whereRaw(`LOWER("eteamname") LIKE LOWER('%${keyword}%')`)
    .whereIn('eteamid', teamIds)
    .page(page, size)
    .then(teams => ServiceHelper.toPageObj(page, size, teams));

}

teamService.getTeams = async (keyword, page, size, user) => {

    return Team.query()
    .where('ecompanyecompanyid', user.companyId)
    .modify('baseAttributes')
    .select('eteamcreatetime', Team.relatedQuery('members').count().as('teamMemberCount') )
    .withGraphFetched('company(baseAttributes)')
    .withGraphFetched('teamIndustry(baseAttributes)')
    .where(raw('lower("eteamname")'), 'like', `%${keyword}%`)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

teamService.getTeamDetail = async (teamId, user) => {

    const userInCompany = await teamService.isUserInCompany(teamId, user)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    return Team.query()
    .modify('baseAttributes')
    .select('eteamcreatetime', Team.relatedQuery('members').count().as('teamMemberCount') )
    .findById(teamId)
    .where('ecompanyecompanyid', user.companyId)
    .withGraphFetched('teamIndustry(baseAttributes)')
    .withGraphFetched('teamAddress(baseAttributes)')
    .then(team => {
        if (!team) throw new NotFoundError()
        return team
    })

}

teamService.getTeamMemberList = async (teamId, user, page, size, keyword) => {

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

    return teamUserMappingService.getTeamMemberListByTeamId(page, size, teamId, keyword)

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

    const isAdmin = await teamUserMappingService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    return teamLogService.getPendingLogByTeamIdAndTypeAndStatus(teamId, type, page, size, TeamLogStatusEnum.PENDING)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

teamService.getUserTeamPendingListByLogType = async (page, size, type, user) => {

    if(type !== 'APPLY' && type !== 'INVITE') 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TYPE_UNACCEPTED)

    return teamLogService.getUserTeamPendingApplyOrTeamInvitationByLogTypeAndUserId(page, size, type, user.sub)
    
}

teamService.processIntoTeam = async (teamId, teamLogId, user, userId) => {

    const teamUserMappingPromise = TeamUserMapping.query().insertToTable({
        eusereuserid: userId,
        eteameteamid: teamId,
        eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
    }, user.sub);

    const teamLogPromise = teamLogService.updateTeamLog(teamLogId, user, TeamLogStatusEnum.ACCEPTED);

    return Promise.all([teamUserMappingPromise, teamLogPromise])

}

teamService.processIntoTeamByTeamLogs = async (teamLogs, user) => {

    const mappings = teamLogs.map(teamLog => ({
        eusereuserid: teamLog.eusereuserid,
        eteameteamid: teamLog.eteameteamid,
        eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
    }))

    const teamUserMappingPromise = teamUserMappingService.createTeamUserMapping(mappings, user);

    const teamLogPromise = teamLogService.updateTeamLogs(teamLogs, user, TeamLogStatusEnum.ACCEPTED);

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

    const isAdmin = await teamUserMappingService.isAdmin(teamId, user.sub)
    
    if(!isAdmin) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    const invitedUsers = await User.query()
        .whereIn('euserid', userIds)

    if (invitedUsers.length !== userIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    const userInTeam = await teamUserMappingService.checkUserInTeamByUserIds(teamId, userIds);

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
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_ALREADY_INVITED)
    }

    const result = {
        invitedUsers: invited,
        appliedUsers: applied
    }

    return result

}

teamService.cancelInvites = async (teamLogIds, user) => {
    
    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndType(teamLogIds, [TeamLogTypeEnum.INVITE])

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    // take the first teamId from invite log
    const isAdmin = await teamUserMappingService.checkAdminByTeamLogsAndUserId(teamLogs, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    // return pendingInvites.$query().delete()
    // .then(rowsAffected => rowsAffected === 1)

    //TODO: FIND OTHER WAY TO USE $query() for list so it doesnt need to be like this
    return TeamLog.query()
    .whereIn('eteamlogid', teamLogIds)
    .delete()
    .then(rowsAffected => rowsAffected === teamLogIds.length)

}

teamService.processRequests = async (teamLogIds, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndType(teamLogIds, [TeamLogTypeEnum.APPLY]);

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    const isAdmin = await teamUserMappingService.checkAdminByTeamLogsAndUserId(teamLogs, user.sub)

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    let processPromise

    if (status === TeamLogStatusEnum.REJECTED)
        processPromise = teamLogService.updateTeamLogs(teamLogs, user, status)

    if (status === TeamLogStatusEnum.ACCEPTED)
        processPromise = teamService.processIntoTeamByTeamLogs(teamLogs, user);

    return processPromise

}

teamService.cancelRequests = async (teamLogIds, user) => {

    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndTypeAndUserId(teamLogIds, [TeamLogTypeEnum.APPLY], user.sub)

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_APPLIED)

    // return teamLog.$query().delete()
    // .then(rowsAffected => rowsAffected === 1)

    return TeamLog.query()
    .whereIn('eteamlogid', teamLogIds)
    .delete()
    .then(rowsAffected => rowsAffected === teamLogIds.length)

}

teamService.processInvitations = async (teamLogIds, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.STATUS_UNACCEPTED)

    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndTypeAndUserId(teamLogIds, [TeamLogTypeEnum.INVITE], user.sub);

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_INVITED)

    let processPromise

    if (status === TeamLogStatusEnum.REJECTED)
        processPromise = teamLogService.updateTeamLogs(teamLogs, user, status)

    if (status === TeamLogStatusEnum.ACCEPTED)
        processPromise = teamService.processIntoTeamByTeamLogs(teamLogs, user);

    return processPromise

}

teamService.joinTeam = async (teamId, user) => {

    // If user already in team
    const userInTeam = await teamUserMappingService.checkUserInTeam(teamId, user.sub);

    if (userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_IN_TEAM)

    const getTeam = await teamService.getTeamDetail(teamId, user)
    .catch(() => null)

    if(!getTeam) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)

    // Check if this user already invited / applied
    const teamLog = await teamLogService.getLogByTeamIdAndUserIdDefaultPending(teamId, user.sub);

    // If there is no pending invite / apply, create apply log
    if (!teamLog) {

        const createTeamLog = await teamLogService.createTeamLog(teamId, user, user.sub, TeamLogTypeEnum.APPLY)

        // if That team that wants to be joined is public ( eteamispublic === true), process into team immediately
        if(getTeam.eteamispublic)
            return teamService.processIntoTeam(teamId, createTeamLog.eteamlogid, user, user.sub);

        return createTeamLog

    // If apply pending exist
    } else if (teamLog.eteamlogtype === TeamLogTypeEnum.APPLY && teamLog.eteamlogstatus === TeamLogStatusEnum.PENDING) {

        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_APPLIED)

    }

    // if invite pending exist
    if (teamLog.eteamlogtype === TeamLogTypeEnum.INVITE && teamLog.eteamlogstatus === TeamLogStatusEnum.PENDING) {

        return teamService.processIntoTeam(teamLog.eteameteamid, teamLog.eteamlogid, user, user.sub);

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
    const userInTeam = await teamUserMappingService.checkUserInTeam(teamId, user.sub);

    if (!userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_TEAM)

    // keep other undefined because not used
    const removeUser = await teamUserMappingService.removeUserFromTeam(userInTeam);

    const teamMemberCount = await teamUserMappingService.getTeamMemberCount(teamId);

    // If team has no member after user leaving
    if (teamMemberCount === 0) {
        await Team.query()
        .where('eteamid', teamId)
        .delete();
    }

    return removeUser

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

    const isAdmin = await teamUserMappingService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    // If user already in team
    const userInTeam = await teamUserMappingService.checkUserInTeam(teamId, userId);

    if (!userInTeam)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_TEAM)

    return teamUserMappingService.removeUserFromTeam(userInTeam, user, userId, TeamLogStatusEnum.KICKED, logMessage);

}

teamService.changeTeamMemberSportRoles = async (teamUserMappingId, user, sportRoleIds) => {

    sportRoleIds = (!sportRoleIds || sportRoleIds.length === 0 ) ? null : sportRoleIds

    const teamUserMapping = await teamUserMappingService.getTeamUsermappingByTeamUserMappingId(teamUserMappingId)
    .catch( () => null)

    if(!teamUserMapping) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_TEAM)

    const isAdmin = await teamUserMappingService.isAdmin(teamUserMapping.eteameteamid, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    return teamSportTypeRoleService
    .insertTeamSportTypeRoles(teamUserMappingId, teamUserMapping.eteameteamid, sportRoleIds, user)

}

teamService.changeTeamMemberPosition = async (teamId, user, userId, position) => {

    if (user.sub === userId)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    const isAdmin = await teamUserMappingService.isAdmin(teamId, user.sub);

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

    const getTeam = await teamService.getTeamDetail(teamId, user)
    .catch(() => null)

    if(!getTeam) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.TEAM_NOT_FOUND)

    const isAdmin = await teamUserMappingService.isAdmin(teamId, user.sub)

    if(!isAdmin) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOT_ADMIN)

    return Team.query()
    .findById(teamId)
    .delete()
    .then(rowsAffected => rowsAffected === 1)
}

module.exports = teamService