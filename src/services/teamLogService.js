const TeamLog = require('../models/TeamLog')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const teamLogService = {}

const TeamLogStatusEnum = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    KICKED: 'KICKED'
}

const TeamLogTypeEnum = {
    APPLY: 'APPLY',
    INVITE: 'INVITE'
}

teamLogService.getPendingLogByTeamLogId = async (teamLogId, types) => {

    return TeamLog.query()
    .findById(teamLogId)
    .whereIn('eteamlogtype', types)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
    .orderBy('eteamlogcreatetime', 'DESC')
    .first();

}

teamLogService.getPendingLogByTeamLogIdsAndType = async (teamLogIds, types) => {

    return TeamLog.query()
    .whereIn('eteamlogid', teamLogIds)
    .whereIn('eteamlogtype', types)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
    .orderBy('eteamlogcreatetime', 'DESC')

}

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

teamLogService.getLogByTeamIdAndUserIdDefaultPending = async (teamId, userId, status = TeamLogStatusEnum.PENDING) => {

    return TeamLog.query()
        .where('eteameteamid', teamId)
        .andWhere('eusereuserid', userId)
        .andWhere('eteamlogstatus', status)
        .orderBy('eteamlogcreatetime', "DESC")
        .first();

}

teamLogService.getPendingLogByUserIds = async (teamId, userIds, types) => {

    return TeamLog.query()
    .whereIn('eusereuserid', userIds)
    .andWhere('eteameteamid', teamId)
    .whereIn('eteamlogtype', types)
    .andWhere('eteamlogstatus', TeamLogStatusEnum.PENDING)
    .orderBy('eteamlogcreatetime', 'DESC')

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

teamLogService.createTeamLog = async (teamId, user, userId, type) => {

    return TeamLog.query().insertToTable({
        eteameteamid: teamId,
        eusereuserid: userId,
        eteamlogtype: type
    }, user.sub);

}

teamLogService.createTeamLogByUserIds = async (teamId, user, userIds, type) => {

    const logDTOs = userIds.map(userId => ({
        eteameteamid: teamId,
        eusereuserid: userId,
        eteamlogtype: type
    }))

    return TeamLog.query().insertToTable(logDTOs, user.sub);

}

teamLogService.updateTeamLog = async (teamLogId, user, status) => {

    const log = await teamLogService.getPendingLogByTeamLogId(teamLogId, [TeamLogTypeEnum.INVITE, TeamLogTypeEnum.APPLY]);

    return log.$query().updateByUserId({
        eteamlogstatus: status
    }, user.sub)
    .returning('*');

}

teamLogService.updateTeamLogs = async (teamLogs, user, status) => {

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

teamLogService.updateKickedTeamLog = async (teamId, user, userId, logMessage, trx) => {

    return TeamLog.query(trx)
    .where('eteameteamid', teamId)
    .where('eusereuserid', userId)
    .updateByUserId({
        eteamlogstatus: TeamLogStatusEnum.KICKED,
        eteamlogmessage: logMessage
    }, user.sub)

}

teamLogService.updateTeamLogByUserIds = async (teamId, user, userIds, status) => {

    await teamLogService.getPendingLogByUserIds(teamId, userIds, [TeamLogTypeEnum.APPLY]);

    return TeamLog.query()
    .whereIn('eusereuserid', userIds)
    .where('eteameteamid', teamId)
    .updateByUserId({
        eteamlogstatus: status
    }, user.sub)
    .returning('*');

}



module.exports = teamLogService