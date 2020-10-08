const Thread = require('../models/Thread')
const ThreadModerator = require('../models/ThreadModerator')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')
const TimeEnum = require('../models/enum/TimeEnum')
const mobileCompanyService = require('./mobileCompanyService')
const mobileTeamService = require('./mobileTeamService')

const mobileForumService = {}

const UnsupportedOperationErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    THREAD_NOT_EXISTS: 'THREAD_NOT_EXISTS',
    INVALID_TYPE: 'INVALID_TYPE'
}

mobileForumService.isModerator = async (threadId, userId) => {

    //if not the maker, check if its the moderator
    return ThreadModerator.query()
        .where('ethreadethreadid', threadId)
        .where('eusereuserid', userId)
        .first()
        .then(moderator => {
            if(!moderator) return false
            return true
    })

}

// Method to be used by other service to check if thread exists
mobileForumService.checkThread = async (threadId) => {

    return Thread.query()
    .findById(threadId)
    .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)
    .then(thread => {
        if(!thread) return false
        return true
    })
    
}

mobileForumService.normalizeFilter = async (filterData) => {

    if(filterData === undefined)
        return { companyId: null, teamId: null }

    const newFilter = {}

    if(!filterData.companyId || filterData.companyId === 0) {
        newFilter.companyId = null
    }

    if(!filterData.teamId || filterData.teamId === 0) {
        newFilter.teamId = null
    }

    return newFilter

}

mobileForumService.createThread = async (threadDTO, user) => {

    if( threadDTO.ecompanyecompanyid && threadDTO.eteameteamid )
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.INVALID_TYPE)

    if( threadDTO.ecompanyecompanyid ) {

        await mobileCompanyService.checkUserInCompany(threadDTO.ecompanyecompanyid, user.sub)
        .then(userInCompany => {
            if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

        })

    }

    if( threadDTO.eteameteamid ) {

        await mobileTeamService.checkUserInTeam(threadDTO.eteameteamid, user.sub)
        .then(userInTeam => {
            if(!userInTeam) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_TEAM)
        })

    }

    return Thread.transaction(async trx => {
            const thread = await Thread.query(trx)
            .insertToTable(threadDTO, user.sub)

            const moderator = await ThreadModerator.query(trx)
            .insertToTable({ethreadethreadid: thread.ethreadid, eusereuserid: user.sub})

            return { thread, moderator }

    })
    
}

mobileForumService.updateThreadById = async (threadId, threadDTO, user) => {
    
    const thread = await Thread.query()
    .findById(threadId)
    .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)

    if(!thread) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_NOT_EXISTS)

    const moderator = await mobileForumService.isModerator(threadId, user.sub)

    if(!moderator) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    if(!thread.ecompanyecompanyid && !thread.eteameteamid) {
        threadDTO.ethreadispublic = thread.ethreadispublic
    }

    return thread
    .$query()
    .updateByUserId(threadDTO, user.sub)
    .returning('*')
    
}

mobileForumService.getThreadList = async (page, size, filter, isPublic) => {

    const getFilter = await mobileForumService.normalizeFilter(filter)

    let threadPromise = Thread.query()
    .modify('baseAttributes')
    .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)

    if(getFilter.companyId !== null) {
        threadPromise = threadPromise
        .where('ecompanyecompanyid', filter.companyId)
    }

    if(getFilter.teamId !== null) {
        threadPromise = threadPromise
        .where('eteameteamid', filter.teamId)
    }

    return threadPromise
    .where('ethreadispublic', isPublic)
    .orderBy('ethreadcreatetime', 'DESC')
    .withGraphFetched('company(baseAttributes)')
    .withGraphFetched('team(baseAttributes)')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

mobileForumService.getThreadDetailById = async (threadId) => {

    return Thread.query()
    .findById(threadId)
    .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)
    .modify('baseAttributes')
    .withGraphFetched('company(baseAttributes)')
    .withGraphFetched('team(baseAttributes)')
    .then(thread => {
        if(!thread) throw new NotFoundError()
        return thread
    })
    
}

mobileForumService.deleteThreadById = async (threadId, user) => {

    const moderator = await mobileForumService.isModerator(threadId, user.sub)

    if(!moderator) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION)

    return Thread.query()
    .findById(threadId)
    .delete()
    .then(rowsAffected => rowsAffected === 1)
    
}

module.exports = mobileForumService