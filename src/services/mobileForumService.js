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
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM'
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

    if(filterData.companyId === undefined || filterData.companyId === null || filterData.companyId === 0) {
        newFilter.companyId = null
    }

    if(filterData.teamId === undefined || filterData.teamId === null || filterData.teamId === 0) {
        newFilter.teamId = null
    }

    return newFilter

}

mobileForumService.createThread = async (threadDTO, user) => {

    if( threadDTO.ecompanyecompanyid !== null ) {

        await mobileCompanyService.checkUserInCompany(threadDTO.ecompanyecompanyid, user.sub)
        .then(userInCompany => {
            if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

        })

    }

    if( threadDTO.eteameteamid !== null) {

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

module.exports = mobileForumService