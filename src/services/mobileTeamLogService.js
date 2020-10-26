const ServiceHelper = require('../helper/ServiceHelper');
const UnsupportedOperationError = require('../models/errors/UnsupportedOperationError');
const TeamLog = require('../models/TeamLog');
const teamUserService = require('./mobileTeamUserService');
const mobileCompanyUserService = require('./mobileCompanyUserService')
const { NotFoundError } = require('../models/errors');
const User = require('../models/User');
const Team = require('../models/Team')

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
    MEMBER: 'MEMBER'
}

const ErrorEnum = {
    USER_IN_TEAM: 'USER_IN_TEAM',
    LOG_NOT_FOUND: 'LOG_NOT_FOUND',
    USER_APPLIED: 'USER_APPLIED',
    TYPE_UNACCEPTED: 'TYPE_UNACCEPTED',
    NOT_ADMIN: 'NOT_ADMIN',
    USER_INVITED: 'USER_INVITED',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    STATUS_UNACCEPTED: 'STATUS_UNACCEPTED',
    USER_NOT_INVITED: 'USER_NOT_INVITED'
}

const teamLogService = {};

// Provide userId on process involving user's not team's
// Example: process invitation (user accept/reject invitation), cancel request(user cancel apply)
teamLogService.getLogByTeamLogIdOptinalUserId = async (teamLogId, userId) => {

    const teamLogPromise = TeamLog.query()
        .findById(teamLogId)

    if (userId)
        teamLogPromise.where('eusereuserid', userId);

    return teamLogPromise
        .then(teamLog => {
            if (!teamLog)
                throw new NotFoundError();
            return teamLog
        });

}

teamLogService.getPendingLogByTeamIdAndTypeAndStatus = async (teamId, type, page, size, logStatus) => {
    
    return TeamLog.query()
    .modify('baseAttributes')
    .withGraphFetched('user(baseAttributes).file(baseAttributes)')
    .where('eteameteamid', teamId)
    .andWhere('eteamlogtype', type)
    .andWhere('eteamlogstatus', logStatus)
    .page(page, size)

}

teamLogService.updateAppliedTeamLogsWithPendingByTeamIdAndStatus = async (teamId, user, status) => {

    return TeamLog.transaction(async trx => {
        await TeamLog.query(trx)
        .where('eteameteamid', teamId)
        .where('eteamlogtype', TeamLogTypeEnum.APPLY)
        .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
        .update({
            eteamlogstatus: status,
            eteamlogchangetime: Date.now(),
            eteamlogchangeby: user.sub
        })
        .returning('*')
        .then(teamLogs => {

            const mappings = teamLogs.map(teamLog => ({
                eusereuserid: teamLog.eusereuserid,
                eteameteamid: teamLog.eteameteamid,
                eteamusermappingposition: TeamUserMappingPositionEnum.MEMBER
            }))

            return teamUserService.createTeamUserMapping(mappings, user, trx)
        })
    })

}

teamLogService.createLog = async (teamId, userId, user, type, status) => {

    return TeamLog.query()
        .insertToTable({
            eteameteamid: teamId,
            eusereuserid: userId,
            eteamlogtype: type,
            eteamlogstatus: status
        }, user.sub);

}

teamLogService.updateLogByIdAndUser = async (teamLogId, user, status) => {

    return teamLogService.getLogByTeamLogIdOptinalUserId(teamLogId, user.sub)
        .catch(() => new UnsupportedOperationError(ErrorEnum.LOG_NOT_FOUND))
        .then(teamLog => {
            teamLog.$query()
                .updateByUserId({
                    eteamlogstatus: status
                }, user.sub)
                .returning('*');
        })

}

teamLogService.getLogByTeamIdAndUserIdDefaultPending = async (teamId, userId, status = TeamLogStatusEnum.PENDING) => {

    return TeamLog.query()
        .where('eteameteamid', teamId)
        .andWhere('eusereuserid', userId)
        .andWhere('eteamlogstatus', status)
        .orderBy('eteamlogcreatetime', "DESC")
        .first();

}

teamLogService.applyTeam = async (teamId, user, isPublic) => {

    await teamUserService.getTeamUserByTeamIdAndUserId(teamId, user.sub)
        .catch(() => new UnsupportedOperationError(ErrorEnum.USER_IN_TEAM));

    const teamLog = await teamLogService.getLogByTeamIdAndUserIdDefaultPending(teamId, user.sub);

    // Not in team and not yet apply
    if (!teamLog) {

        let status = '';

        if (isPublic) {
            status = TeamLogStatusEnum.ACCEPTED;
            await teamUserService.joinTeam(teamId, user);
        } else
            status = TeamLogStatusEnum.PENDING;

        return teamLogService.createLog(teamId, user.sub, user, TeamLogTypeEnum.APPLY, status);

    } else if (TeamLogTypeEnum.APPLY === teamLog.eteamlogtype) {

        if (!isPublic)
            throw new UnsupportedOperationError(ErrorEnum.USER_APPLIED)

        await teamUserService.joinTeamByTeamLogs([teamLog], user);
        return teamLogService.updateLogsByTeamLogs([teamLog], TeamLogStatusEnum.ACCEPTED, user);

    } else if (TeamLogTypeEnum.INVITE === teamLog.eteamlogtype) {

        await teamUserService.joinTeamByTeamLogs([teamLog], user);
        return teamLogService.updateLogsByTeamLogs([teamLog], TeamLogStatusEnum.ACCEPTED, user);

    }

}

teamLogService.cancelRequests = async (teamLogIds, user) => {

    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndTypeOptinalUserId(teamLogIds, [TeamLogTypeEnum.APPLY], user.sub);

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_APPLIED)

    return TeamLog.query()
        .whereIn('eteamlogid', teamLogIds)
        .delete()
        .then(rowsAffected => rowsAffected === teamLogIds.length);

}

teamLogService.processRequests = async (teamLogIds, user, status) => {

    if (TeamLogStatusEnum.ACCEPTED !== status && TeamLogStatusEnum.REJECTED !== status)
        throw new UnsupportedOperationError(ErrorEnum.STATUS_UNACCEPTED)

    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndTypeOptinalUserId(teamLogIds, [TeamLogTypeEnum.APPLY])

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_APPLIED)

    const isAdmin = await teamUserService.checkAdminByTeamLogsAndUserId(teamLogs, user.sub);

    if(!isAdmin)
        throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN)

    if (TeamLogStatusEnum.ACCEPTED === status) {
        await teamUserService.joinTeamByTeamLogs(teamLogs, user);
    }

    return teamLogService.updateLogsByTeamLogs(teamLogs, status, user);

}

teamLogService.getPendingLogs = async (teamId, page, size, type, user) => {

    if (TeamLogTypeEnum.APPLY !== type && TeamLogTypeEnum.INVITE !== type)
        throw new UnsupportedOperationError(ErrorEnum.TYPE_UNACCEPTED);

    if (teamId) {
        const isAdmin = await teamUserService.getTeamUserCheckAdmin(teamId, user.sub)
            .catch(() => false);

        if (!isAdmin)
            return ServiceHelper.toEmptyPage(page, size);

    }

    const teamLogsPromise = TeamLog.query()
        .modify('baseAttributes')
        .where('eteamlogstatus', TeamLogStatusEnum.PENDING)
        .andWhere('eteamlogtype', type)

    if (teamId) {
        teamLogsPromise.andWhere('eteameteamid', teamId)
        .withGraphFetched('user(baseAttributes).file(baseAttributes)')
    }

    if (!teamId) {
        teamLogsPromise.andWhere('eusereuserid', user.sub)
            .withGraphFetched('team(baseAttributes).teamIndustry(baseAttributes)')
    }

    return teamLogsPromise
        .page(page, size)
        .then(teamLogs => 
            ServiceHelper.toPageObj(page, size, teamLogs)
        )

}

teamLogService.getPendingTeamLogs = async (teamId, page, size, type, user) => {

    return teamLogService.getPendingLogs(teamId, page, size, type, user);

}

teamLogService.getPendingLogByTeamLogIdsAndTypeOptinalUserId = async (teamLogIds, types, userId = null) => {

    const teamLogsPromise = TeamLog.query()
    .whereIn('eteamlogid', teamLogIds)
    .whereIn('eteamlogtype', types)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)

    if (userId)
        teamLogsPromise.andWhere('eusereuserid', userId);

    return teamLogsPromise
        .then(teamLogs => {
            return teamLogs
        })

}

teamLogService.getPendingUserLogs = async (page, size, type, user) => {

    return teamLogService.getPendingLogs(null, page, size, type, user);

}

teamLogService.invite = async (teamId, user, email) => {

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    const invitedUser = await User.query()
    .where('euseremail', email)
    .first();

    //to check is user in company
    await Team.query()
    .findById(teamId)
    .then(team => {
        if (team.ecompanyecompanyid)
            return mobileCompanyUserService.checkUserInCompany(invitedUser.euserid, team.ecompanyecompanyid)
    })

    if (!invitedUser)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_EXIST)

    const teamUser = await teamUserService.getTeamUserByTeamIdAndUserId(teamId, invitedUser.euserid)
        .catch(() => null);

    if (teamUser)
        throw new UnsupportedOperationError(ErrorEnum.USER_IN_TEAM);

    const teamLog = await teamLogService.getLogByTeamIdAndUserIdDefaultPending(teamId, invitedUser.euserid);

    if (!teamLog)

        return teamLogService.createLog(teamId, invitedUser.euserid, user, TeamLogTypeEnum.INVITE, TeamLogStatusEnum.PENDING);

    else {

        if (TeamLogTypeEnum.INVITE === teamLog.eteamlogtype)
            throw new UnsupportedOperationError(ErrorEnum.USER_INVITED);
        else {
            await teamUserService.joinTeamByTeamLogs([teamLog], user)
            return teamLogService.updateLogsByTeamLogs([teamLog], TeamLogStatusEnum.ACCEPTED, user);
        }

    }
    
}

teamLogService.cancelInvites = async (teamLogIds, user) => {

    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndTypeOptinalUserId(teamLogIds, [TeamLogTypeEnum.INVITE])

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_INVITED)

    const isAdmin = await teamUserService.checkAdminByTeamLogsAndUserId(teamLogs, user.sub);

    if(!isAdmin)
        throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN)

    return TeamLog.query()
        .whereIn('eteamlogid', teamLogIds)
        .delete()
        .then(rowsAffected => rowsAffected === teamLogIds.length);
    
}

teamLogService.updateLog = async (teamLog, status, user) => {

    return teamLog.$query()
        .updateByUserId({
            eteamlogstatus: status
        }, user.sub)
        .returning('*');

}

teamLogService.updateLogsByTeamLogs = async (teamLogs, status, user) => {

    const teamLogIds = teamLogs.map(teamLog => teamLog.eteamlogid)

    return TeamLog
    .query()
    .whereIn('eteamlogid', teamLogIds)
    .update({
        eteamlogstatus: status,
        eteamlogchangetime: Date.now(),
        eteamlogchangeby: user.sub
    })
    .returning('*');

}

teamLogService.processInvitations = async (teamLogIds, user, status) => {

    if (TeamLogStatusEnum.ACCEPTED !== status && TeamLogStatusEnum.REJECTED !== status)
        throw new UnsupportedOperationError(ErrorEnum.STATUS_UNACCEPTED)

    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndTypeOptinalUserId(teamLogIds, [TeamLogTypeEnum.INVITE], user.sub);

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_INVITED)

    if (TeamLogStatusEnum.ACCEPTED === status) {
        await teamUserService.joinTeamByTeamLogs(teamLogs, user);
    }

    return teamLogService.updateLogsByTeamLogs(teamLogs, status, user);

}

module.exports = teamLogService;