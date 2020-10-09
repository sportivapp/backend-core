const ServiceHelper = require('../helper/ServiceHelper');
const UnsupportedOperationError = require('../models/errors/UnsupportedOperationError');
const TeamLog = require('../models/TeamLog');
const teamUserService = require('./mobileTeamUserService');
const teamService = require('./mobileTeamService');
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
    USER_INVITED: 'USER_INVITED'
}

const teamLogService = {};

teamLogService.getLogByTeamLogId = async (teamLogId) => {

    return TeamLog.query()
        .findById(teamLogId)
        .then(teamLog => {
            if (!teamLog)
                throw new NotFoundError();
            return teamLog
        });

}

teamLogService.createLog = async (teamId, userId, type, status) => {

    return TeamLog.query()
        .insertToTable({
            eteameteamid: teamId,
            eusereuserid: userId,
            eteamlogtype: type,
            eteamlogstatus: status
        })

}

teamLogService.updateLogById = async (teamLogId, status, user) => {

    return teamLogService.getLogByTeamLogId(teamLogId)
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

teamLogService.applyTeam = async (teamId, user) => {

    const teamUser = await teamUserService.checkTeamUserByTeamIdAndUserId(teamId, user.sub);

    if (teamUser)
        throw new UnsupportedOperationError(ErrorEnum.USER_IN_TEAM);

    const team = await teamService.getTeamById(teamId);

    const teamLog = await teamLogService.getLogByTeamIdAndUserIdDefaultPending(teamId, user.sub);

    // Not in team and not yet apply
    if (!teamLog) {

        let status = '';

        if (team.eteamispublic)
            status = TeamLogStatusEnum.ACCEPTED
        else
            status = TeamLogStatusEnum.PENDING

        const newTeamLog = await teamLogService.createLog(teamId, user.sub, TeamLogTypeEnum.APPLY, status);

        if (team.eteamispublic)
            return teamUserService.joinTeam(teamId, user.sub, user);

        return newTeamLog;

    } else if (teamLog.eteamlogtype === TeamLogTypeEnum.APPLY) {

        if (team.eteamispublic) {
            await teamUserService.joinTeam(teamId, user.sub, user);
            return teamLogService.updateLogById(teamLog.eteamlogid, TeamLogStatusEnum.ACCEPTED, user.sub);
        } else
            throw new UnsupportedOperationError(ErrorEnum.USER_APPLIED)

    } else if (teamLog.eteamlogtype === TeamLogTypeEnum.INVITE) {
        await teamUserService.joinTeam(teamId, user.sub, user);
        return teamLogService.updateLogById(teamLog.eteamlogid, TeamLogStatusEnum.ACCEPTED, user);
    }

}

teamLogService.cancelRequest = async (teamLogId, user) => {

    // TODO: check whether log is this user's
    const teamLog = await teamLogService.getLogByTeamLogId(teamLogId);

    if (teamLog.eteamlogtype !== TeamLogTypeEnum.APPLY)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_APPLIED)

    return teamLog.$query()
        .del()
        .then(rowsAffected => rowsAffected === 1);

}

teamLogService.processRequest = async (teamLogId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(ErrorEnum.STATUS_UNACCEPTED)

    const teamLog = await teamLogService.getLogByTeamLogId(teamLogId);

    const isAdmin = await teamUserService.isAdmin(teamLog.eteameteamid, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN);

    if (teamLog.eteamlogtype !== TeamLogTypeEnum.APPLY)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_APPLIED)

    if (status === TeamLogStatusEnum.ACCEPTED) {
        await teamUserService.joinTeam(teamLog.eteameteamid, user.sub, user);
    }

    return teamLogService.updateLog(teamLog, status, user);

}

teamLogService.getPendingLogs = async (teamId, page, size, type, user, filter) => {

    if (TeamLogTypeEnum.APPLY !== type && TeamLogTypeEnum.INVITE !== type)
        throw new UnsupportedOperationError(ErrorEnum.TYPE_UNACCEPTED);

    if (filter.teamId !== null) {
        const isAdmin = await teamUserService.isAdmin(teamId, user.sub);

        if (!isAdmin)
            throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN);
    }

    const teamLogsPromise = TeamLog.query()
        .modify('baseAttributes')
        .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
        .andWhere('eteamlogtype', type)
        .withGraphFetched('user(baseAttributes)')

    if (filter.teamId !== null)
        teamLogsPromise.where('eteameteamid', filter.teamId);

    if (filter.userId !== null)
        teamLogsPromise.where('eusereuserid', filter.userId);

    return teamLogsPromise
        .page(page, size)
        .then(teamLogs => 
            ServiceHelper.toPageObj(page, size, teamLogs)
        )

}

teamLogService.getPendingTeamLogs = async (teamId, page, size, type, user) => {

    const filter = {
        teamId: teamId,
        userId: null
    }

    return teamLogService.getPendingLogs(teamId, page, size, type, user, filter);

}

teamLogService.getPendingUserLogs = async (teamId, page, size, type, user) => {

    const filter = {
        teamId: null,
        userId: user.sub
    }

    return teamLogService.getPendingLogs(teamId, page, size, type, user, filter);

}

teamLogService.invite = async (teamId, user, email) => {

    const isAdmin = await teamUserService.isAdmin(teamId, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN);

    const invitedUser = await User.query()
    .where('euseremail', email)
    .first();

    if (!invitedUser)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    const teamUser = await teamUserService.checkTeamUserByTeamIdAndUserId(teamId, invitedUser.euserid);

    if (teamUser)
        throw new UnsupportedOperationError(ErrorEnum.USER_IN_TEAM);

    const teamLog = await teamLogService.getLogByTeamIdAndUserIdDefaultPending(teamId, invitedUser.euserid);

    if (!teamLog)

        return teamLogService.createLog(teamId, invitedUser.euserid, TeamLogTypeEnum.INVITE, TeamLogStatusEnum.PENDING);

    else {

        if (teamLog.eteamlogtype === TeamLogTypeEnum.APPLY) {
            await teamUserService.joinTeam(teamId, invitedUser.euserid, user)
            return teamLogService.updateLogById(teamLog.eteamlogid, TeamLogStatusEnum.ACCEPTED, user.sub);
        } else 
            throw new UnsupportedOperationError(ErrorEnum.USER_INVITED);

    }
    
}

teamLogService.cancelInvite = async (teamLogId, user) => {

    const teamLog = await teamLogService.getLogByTeamLogId(teamLogId);

    const isAdmin = await teamUserService.isAdmin(teamLog.eteameteamid, user.sub);

    if (!isAdmin)
        throw new UnsupportedOperationError(ErrorEnum.NOT_ADMIN);

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

teamLogService.processInvitation = async (teamLogId, user, status) => {

    if (status !== TeamLogStatusEnum.ACCEPTED && status !== TeamLogStatusEnum.REJECTED)
        throw new UnsupportedOperationError(ErrorEnum.STATUS_UNACCEPTED)

    const teamLog = await teamLogService.getLogByTeamLogId(teamLogId);

    if (teamLog.eteamlogtype !== TeamLogTypeEnum.INVITE)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_INVITED)

    if (status === TeamLogStatusEnum.ACCEPTED) {
        await teamUserService.joinTeam(teamLog.eteameteamid, user.sub, user);
    }

    return teamLogService.updateLog(teamLog, status, user);

}

module.exports = teamLogService;