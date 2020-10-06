const Thread = require('../models/Thread')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError } = require('../models/errors')
const TimeEnum = require('../models/enum/TimeEnum')

const mobileForumService = {}

mobileForumService.checkFilter = async (filterData) => {

    if(filterData === undefined)
        return { companyId: null, teamId: null }

    const newFilter = {}

    if(filterData.companyId === undefined || filterData.companyId === null || filterData.companyId === 0) {
        newFilter.companyId = null
    } else {
        newFilter.companyId = filterData.companyId
    }

    if(filterData.teamId === undefined || filterData.teamId === null || filterData.teamId === 0) {
        newFilter.teamId = null
    } else {
        newFilter.teamId = filterData.teamId
    }

    return newFilter

}

mobileForumService.getThreadList = async (page, size, filter) => {

    const getFilter = await mobileForumService.checkFilter(filter)

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
    .orderBy('ethreadcreatetime', 'DESC')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

    
}

mobileForumService.getThreadDetailById = async (threadId) => {

    return Thread.query()
    .findById(threadId)
    .modify('baseAttributes')
    .withGraphFetched('comments')
    .then(thread => {
        if(!thread) throw new NotFoundError()
        return thread
    })
    
}

module.exports = mobileForumService