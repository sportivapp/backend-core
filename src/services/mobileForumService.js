const Thread = require('../models/Thread')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError } = require('../models/errors')
const TimeEnum = require('../models/enum/TimeEnum')

const mobileForumService = {}

mobileForumService.getThreadList = async (page, size, filter) => {

    if(filter === undefined)
        return Thread.query()
        .modify('baseAttributes')
        .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)
        .orderBy('ethreadcreatetime', 'DESC')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

    if(filter.companyId === undefined)
        return Thread.query()
        .modify('baseAttributes')
        .where('eteameteamid', filter.teamId)
        .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)
        .orderBy('ethreadcreatetime', 'DESC')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

    if(filter.teamId === undefined)
        return Thread.query()
        .modify('baseAttributes')
        .where('ecompanyecompanyid', filter.companyId)
        .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)
        .orderBy('ethreadcreatetime', 'DESC')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

    // if filter isn't undefined and teamid and companyid isn't undefined too, then do this
    return Thread.query()
    .modify('baseAttributes')
    .where('eteameteamid', filter.teamId)
    .where('ecompanyecompanyid', filter.companyId)
    .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)
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