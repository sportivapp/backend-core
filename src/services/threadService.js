const Thread = require('../models/Thread')
const SortEnum = require('../models/enum/SortEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const fileService = require('./fileService')
const threadModeratorService = require('./threadModeratorService')
const companyService = require('./companyService')
const teamService = require('./teamService')
const { raw } = require('objection')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const threadService = {}

const ErrorEnum = {
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
    INVALID_TYPE: 'INVALID_TYPE',
    COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
    TEAM_NOT_FOUND: 'TEAM_NOT_FOUND',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION'
}

threadService.getAllThreads = async (page, size, keyword, isPublic, filter) => {

    if (filter.companyId && filter.teamId) return ServiceHelper.toEmptyPage(page, size)

    let sortColumnName = 'ethreadcreatetime'
    let sortDirection = 'DESC'

    if (SortEnum.OLDEST === filter.sort) {
        sortDirection = 'ASC'
    }

    return Thread.query()
        .select(Thread.relatedQuery('comments').count().as('commentCount'))
        .modify('baseAttributes')
        .where(raw('lower("ethreadtitle")'), 'like', `%${keyword}%`)
        .andWhere('ecompanyecompanyid', filter.companyId)
        .andWhere('eteameteamid', filter.teamId)
        .orderBy(sortColumnName, sortDirection)
        .page(page ,size)
        .then(threadPage => ServiceHelper.toPageObj(page, size, threadPage))
}

threadService.getThreadById = async (threadId) => {
    const thread = await Thread.query()
        .findById(threadId)
        .select(Thread.relatedQuery('comments').count().as('commentCount'))
        .modify('baseAttributes')
        .then(thread => {
            if (!thread) throw new NotFoundError()
            return thread
        })

    const moderators = await threadModeratorService.getThreadModerators(threadId)

    return { ...thread, moderators: moderators }
}

threadService.createThread = async (threadDTO, isPublic, moderatorIds, user) => {

    if (threadDTO.ecompanyecompanyid && threadDTO.eteameteamid) throw new UnsupportedOperationError(ErrorEnum.INVALID_TYPE)

    if (!threadDTO.ecompanyecompanyid && !threadDTO.eteameteamid) threadDTO.ethreadispublic = true
    else threadDTO.ethreadispublic = isPublic

    if (threadDTO.ecompanyecompanyid) {
        const company = await companyService.getCompanyById(threadDTO.ecompanyecompanyid)
        if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)
    }

    if (threadDTO.eteameteamid) {
        const team = await teamService.getTeamDetail(threadDTO.eteameteamid, user)
        if (!team) throw new UnsupportedOperationError(ErrorEnum.TEAM_NOT_FOUND)
    }

    return Thread.transaction(async trx => {

        const thread = await Thread.query(trx)
            .insertToTable(threadDTO, user.sub)

        const threadModerators = await threadModeratorService.saveThreadModerators(thread.ethreadid, moderatorIds, user, trx)

        return Promise.resolve({ ...thread, moderators: [threadModerators] })

    })

}

threadService.updateThread = async (threadId, threadDTO, isPublic, moderatorIds, user) => {

    if (!threadDTO.ecompanyecompanyid && !threadDTO.eteameteamid) threadDTO.ethreadispublic = true
    else threadDTO.ethreadispublic = isPublic

    const thread = await threadService.getThreadById(threadId)
        .catch(() => new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND))

    const isModerator = await threadModeratorService.isThreadModerator(threadId, user.sub)

    if (!isModerator) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)

    return Thread.transaction(async trx => {

        const updatedThread = thread.$query(trx)
            .updateByUserId(threadDTO, user.sub)
            .returning('*')

        const threadModerators = threadModeratorService.saveThreadModerators(thread.ethreadid, moderatorIds, user, trx)

        return Promise.all([updatedThread, threadModerators])
            .then(([thread, threadModerators]) => ({ ...thread, moderators: [threadModerators] }))

    })

}

threadService.deleteThreadById = async (threadId, user) => {

    const isModerator = await threadModeratorService.isThreadModerator(threadId, user.sub)

    if (!isModerator) return false

    return threadService.getThreadById(threadId)
        .catch(() => false)
        .then(thread => thread.$query().delete())
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = threadService