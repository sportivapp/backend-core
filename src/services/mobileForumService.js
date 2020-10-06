const Thread = require('../models/Thread')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError } = require('../models/errors')

const mobileForumService = {}

mobileForumService.getThreadList = async (page, size) => {

    return Thread.query()
    .modify('baseAttributes')
    .where('ethreadcreatetime', '>', Date.now() - (2592000000 * 3)) // 2592000000 equals to 30 days, times 3 to be 3 months
    .orderBy('ethreadcreatetime', 'DESC')
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

mobileForumService.getThreadDetailById = async (threadId) => {

    return Thread.query()
    .findById(threadId)
    .modify('baseAttributes')
    .withGraphFetched('threadPost')
    .then(thread => {
        if(!thread) throw new NotFoundError()
        return thread
    })
    
}

module.exports = mobileForumService