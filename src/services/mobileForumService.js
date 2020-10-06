const Thread = require('../models/Thread')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError } = require('../models/errors')
const TimeEnum = require('../models/enum/TimeEnum')

const mobileForumService = {}

mobileForumService.getThreadList = async (page, size) => {

    return Thread.query()
    .modify('baseAttributes')
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