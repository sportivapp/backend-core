const ServiceHelper = require('../helper/ServiceHelper');
const UnsupportedOperationError = require('../models/errors/UnsupportedOperationError');
const TeamLog = require('../models/TeamLog');
const teamUserService = require('./mobileTeamUserService');
const { NotFoundError } = require('../models/errors');
const User = require('../models/User');

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
const ErrorEnum = {
    USER_IN_TEAM: 'USER_IN_TEAM',
    LOG_NOT_FOUND: 'LOG_NOT_FOUND',
    USER_APPLIED: 'USER_APPLIED',
    TYPE_UNACCEPTED: 'TYPE_UNACCEPTED',
    NOT_ADMIN: 'NOT_ADMIN',
    USER_INVITED: 'USER_INVITED',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    USER_NOT_APPLIED: 'USER_NOT_APPLIED',
    STATUS_UNACCEPTED: 'STATUS_UNACCEPTED'
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
            await teamUserService.joinTeam(teamId, user.sub, user);
        } else
            status = TeamLogStatusEnum.PENDING;

        return teamLogService.createLog(teamId, user.sub, user, TeamLogTypeEnum.APPLY, status);

    } else if (TeamLogTypeEnum.APPLY === teamLog.eteamlogtype) {

        if (!isPublic)
            throw new UnsupportedOperationError(ErrorEnum.USER_APPLIED)

        await teamUserService.joinTeam(teamId, user.sub, user);
        return teamLogService.updateLogByIdAndUser(teamLog.eteamlogid, user, TeamLogStatusEnum.ACCEPTED);

    } else if (TeamLogTypeEnum.INVITE === teamLog.eteamlogtype) {

        await teamUserService.joinTeam(teamId, user.sub, user);
        return teamLogService.updateLogByIdAndUser(teamLog.eteamlogid, user, TeamLogStatusEnum.ACCEPTED);

    }

}

teamLogService.cancelRequest = async (teamLogId, user) => {

    const teamLog = await teamLogService.getLogByTeamLogIdOptinalUserId(teamLogId, user.sub);

    if (TeamLogTypeEnum.APPLY !== teamLog.eteamlogtype)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_APPLIED)

    return teamLog.$query()
        .del()
        .then(rowsAffected => rowsAffected === 1);

}

teamLogService.processRequests = async (teamLogIds, user, status) => {

    if (TeamLogStatusEnum.ACCEPTED !== status && TeamLogStatusEnum.REJECTED !== status)
        throw new UnsupportedOperationError(ErrorEnum.STATUS_UNACCEPTED)

    const teamLogs = await teamLogService.getPendingLogByTeamLogIdsAndType(teamLogIds, [TeamLogTypeEnum.APPLY])

    if (teamLogs.length !== teamLogIds.length)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_APPLIED)

    await teamUserService.checkTeamUserCheckAdmin(teamLogs[0].eteameteamid, user.sub);

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

teamLogService.getPendingLogByTeamLogIdsAndType = async (teamLogIds, types) => {

    return TeamLog.query()
    .whereIn('eteamlogid', teamLogIds)
    .whereIn('eteamlogtype', types)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)

}

teamLogService.getPendingUserLogs = async (page, size, type, user) => {

    return teamLogService.getPendingLogs(null, page, size, type, user);

}

teamLogService.invite = async (teamId, user, email) => {

    await teamUserService.getTeamUserCheckAdmin(teamId, user.sub);

    const invitedUser = await User.query()
    .where('euseremail', email)
    .first();

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
            await teamUserService.joinTeam(teamId, invitedUser.euserid, user)
            return teamLogService.updateLogByIdAndUser(teamLog.eteamlogid, user, TeamLogStatusEnum.ACCEPTED);
        }

    }
    
}

teamLogService.cancelInvite = async (teamLogId, user) => {

    const teamLog = await teamLogService.getLogByTeamLogIdOptinalUserId(teamLogId, null);

    await teamUserService.getTeamUserCheckAdmin(teamLog.eteameteamid, user.sub);

    return teamLog.$query()
        .del()
        .then(rowsAffected => rowsAffected === 1);
    
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

teamLogService.processInvitation = async (teamLogId, user, status) => {

    if (TeamLogStatusEnum.ACCEPTED !== status && TeamLogStatusEnum.REJECTED !== status)
        throw new UnsupportedOperationError(ErrorEnum.STATUS_UNACCEPTED)

    const teamLog = await teamLogService.getLogByTeamLogIdOptinalUserId(teamLogId, user.sub);

    if (TeamLogTypeEnum.INVITE !== teamLog.eteamlogtype)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_INVITED)

    if (TeamLogStatusEnum.ACCEPTED === status) {
        await teamUserService.joinTeam(teamLog.eteameteamid, user.sub, user);
    }

    return teamLogService.updateLog(teamLog, status, user);

}

module.exports = teamLogService;