const Thread = require('../models/Thread')
const ThreadModerator = require('../models/ThreadModerator')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')
const TimeEnum = require('../models/enum/TimeEnum')
const mobileCompanyService = require('./mobileCompanyService')
const mobileTeamUserService = require('./mobileTeamUserService')
const teamUserService = require('./mobileTeamUserService')

const mobileForumService = {}

const ErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
    INVALID_TYPE: 'INVALID_TYPE',
    NOT_ADMIN: 'NOT_ADMIN',
    TITLE_EXISTED: 'TITLE_EXISTED',
    PRIVATE_NOT_AVAILABLE: 'PRIVATE_NOT_AVAILABLE'
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

mobileForumService.checkTitleExist = async (title) => {

    return Thread.query()
        .whereRaw(`LOWER("ethreadtitle") = LOWER('${title}')`)
        .first()
        .then(thread => {
            if (thread)
                throw new UnsupportedOperationError(ErrorEnum.TITLE_EXISTED);
            return false;
        });

}

mobileForumService.createThread = async (threadDTO, user) => {

    await mobileForumService.checkTitleExist(threadDTO.ethreadtitle);

    if( threadDTO.ecompanyecompanyid && threadDTO.eteameteamid )
        throw new UnsupportedOperationError(ErrorEnum.INVALID_TYPE)

    // If team thread AND it is public, check whether it's made by an Admin
    if(threadDTO.eteameteamid && threadDTO.ethreadispublic)
        await teamUserService.getTeamUserCheckAdmin(threadDTO.eteameteamid, user.sub);

    if( threadDTO.ecompanyecompanyid ) {

        await mobileCompanyService.checkUserInCompany(threadDTO.ecompanyecompanyid, user.sub)
            .then(userInCompany => {
                if(!userInCompany) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
            })

        // TODO: Check whether this user have priviledge to make a thread

    }

    return Thread.transaction(async trx => {
        
            const thread = await Thread.query(trx)
                .insertToTable(threadDTO, user.sub)

            const moderator = await ThreadModerator.query(trx)
                .insertToTable({ethreadethreadid: thread.ethreadid, eusereuserid: user.sub});

            return Promise.resolve({ thread, moderator });

    })
    
}

mobileForumService.updateThreadById = async (threadId, threadDTO, user) => {

    await mobileForumService.checkTitleExist(threadDTO.ethreadtitle);
    
    const thread = await mobileForumService.getThreadById(threadId);

    const moderator = await mobileForumService.isModerator(thread.ethreadid, user.sub)

    if(!moderator) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION);

    // If user made the thread, cannot be private
    if(!thread.eteameteamid && !thread.ecompanyecompanyid && !threadDTO.ethreadispublic)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.PRIVATE_NOT_AVAILABLE);

    // If team thread AND it is public, check whether it's made by an Admin
    if(thread.eteameteamid && thread.ethreadispublic)
        await teamUserService.getTeamUserCheckAdmin(thread.eteameteamid, user.sub);

    if(thread.ecompanyecompanyid && thread.ethreadispublic) {

        await mobileCompanyService.checkUserInCompany(thread.ecompanyecompanyid, user.sub)
            .then(userInCompany => {
                if(!userInCompany) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
            });

        // TODO: Check whether this user have privilege to update a thread
        
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
    .select('ethreadcreatetime', Thread.relatedQuery('comments').count().as('commentsCount'))
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
    .withGraphFetched('threadCreator(name)')
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
    .select('ethreadcreatetime', Thread.relatedQuery('comments').count().as('commentsCount'))
    .withGraphFetched('threadCreator(name).file(baseAttributes)')
    .withGraphFetched('company(baseAttributes)')
    .withGraphFetched('team(baseAttributes)')
    .then(thread => {
        if(!thread) throw new NotFoundError()
        return thread
    })
    
}

mobileForumService.getThreadById = async (threadId) => {

    return Thread.query()
        .findById(threadId)
        .where('ethreadcreatetime', '>', Date.now() - TimeEnum.THREE_MONTHS)
        .then(thread => {
            if(!thread) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.THREAD_NOT_FOUND);
            return thread;
        });

}

mobileForumService.deleteThreadById = async (threadId, user) => {

    const moderator = await mobileForumService.isModerator(threadId, user.sub)

    if(!moderator) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FORBIDDEN_ACTION);

    return mobileForumService.getThreadById(threadId)
        .then(thread => {
            thread.$query()
                .del()
                .then(rowsAffected => rowsAffected === 1);
        });

}

module.exports = mobileForumService