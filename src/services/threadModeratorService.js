const ThreadModerator = require('../models/ThreadModerator')
const userService = require('./userService')
const { UnsupportedOperationError } = require('../models/errors')

const threadModeratorService = {}

const ErrorEnum = {
    USER_NOT_FOUND: 'USER_NOT_FOUND'
}

threadModeratorService.saveThreadModerators = async (threadId, userIds, user, db) => {

    const users = await userService.getAllUsersByUserIds(userIds)

    if (users.length !== userIds.length) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_FOUND)

    const moderatorDTOs = userIds.map(userId => ({ ethreadethreadid: threadId, eusereuserid: userId }))
    return ThreadModerator.query(db)
        .where('ethreadethreadid', threadId)
        .delete()
        .then(() => ThreadModerator.query(db).insertToTable(moderatorDTOs, user.sub))
}

threadModeratorService.getThreadModerators = async (threadId) => {
    return ThreadModerator.relatedQuery('user')
        .for(ThreadModerator.query().where('ethreadethreadid', threadId))
}

threadModeratorService.isThreadModerator = async (threadId, userId) => {

    return ThreadModerator.query()
        .where('ethreadethreadid', threadId)
        .andWhere('eusereuserid', userId)
        .first()
}

module.exports = threadModeratorService