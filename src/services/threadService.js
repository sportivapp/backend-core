const Thread = require('../models/Thread')
const SortEnum = require('../models/enum/SortEnum')
const ServiceHelper = require('../helper/ServiceHelper')
const teamUserService = require('./mobileTeamUserService')
const threadModeratorService = require('./threadModeratorService')
const companyService = require('./companyService')
const fileService = require('./fileService')
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
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY'
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

    if (threadDTO.efileefileid) {
        const file = await fileService.getFileById(threadDTO.efileefileid)
        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    }

    if (threadDTO.ecompanyecompanyid) {
        const company = await companyService.getCompanyById(threadDTO.ecompanyecompanyid)
        if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)
    }

    if (threadDTO.eteameteamid) {
        const team = await teamService.getTeamDetail(threadDTO.eteameteamid, user)
        if (!team) throw new UnsupportedOperationError(ErrorEnum.TEAM_NOT_FOUND)
    }

    // If team thread AND it is public, check whether it's made by an Admin
    if(threadDTO.eteameteamid && threadDTO.ethreadispublic)
        await teamUserService.getTeamUserCheckAdmin(threadDTO.eteameteamid, user.sub);

    if(threadDTO.ecompanyecompanyid) {

        const isUserExistInCompany = await companyService.isUserExistInCompany(threadDTO.ecompanyecompanyid, user.sub)

        if (!isUserExistInCompany) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)

        // TODO: Check whether this user have priviledge to make a thread

    }

    return Thread.transaction(async trx => {

        const thread = await Thread.query(trx)
            .insertToTable(threadDTO, user.sub)

        const moderators = await threadModeratorService.saveThreadModerators(thread.ethreadid, moderatorIds, user, trx)

        return Promise.resolve({ ...thread, moderators: moderators })

    })

}

threadService.updateThread = async (threadId, threadDTO, isPublic, moderatorIds, user) => {

    if (!threadDTO.ecompanyecompanyid && !threadDTO.eteameteamid) threadDTO.ethreadispublic = true
    else threadDTO.ethreadispublic = isPublic

    const thread = await Thread.query().findById(threadId)

    if (!thread) throw new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND)

    const isModerator = await threadModeratorService.isThreadModerator(threadId, user.sub)

    if (!isModerator) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)

    if (threadDTO.efileefileid) {
        const file = await fileService.getFileById(threadDTO.efileefileid)
        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    }

    // If team thread AND it is public, check whether it's made by an Admin
    if(threadDTO.eteameteamid && threadDTO.ethreadispublic)
        await teamUserService.getTeamUserCheckAdmin(threadDTO.eteameteamid, user.sub);

    if(threadDTO.ecompanyecompanyid) {

        const isUserExistInCompany = await companyService.isUserExistInCompany(threadDTO.ecompanyecompanyid, user.sub)

        if (!isUserExistInCompany) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)

        // TODO: Check whether this user have priviledge to make a thread

    }

    return Thread.transaction(async trx => {

        const updatedThread = thread.$query(trx)
            .updateByUserId(threadDTO, user.sub)
            .returning('*')

        const threadModerators = threadModeratorService.saveThreadModerators(thread.ethreadid, moderatorIds, user, trx)

        return Promise.all([updatedThread, threadModerators])
            .then(([thread, threadModerators]) => ({ ...thread, moderators: threadModerators }))

    })

}

threadService.deleteThreadById = async (threadId, user) => {

    const thread = await Thread.query().findById(threadId)

    if (!thread) return false

    const isModerator = await threadModeratorService.isThreadModerator(threadId, user.sub)

    if (!isModerator) return false

    return thread.$query()
        .delete()
        .then(rowsAffected => rowsAffected === 1)
}

module.exports = threadService