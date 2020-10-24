const Thread = require('../models/Thread')
const ThreadModerator = require('../models/ThreadModerator')
const ServiceHelper = require('../helper/ServiceHelper')
const { NotFoundError, UnsupportedOperationError } = require('../models/errors')
const TimeEnum = require('../models/enum/TimeEnum')
const mobileCompanyService = require('./mobileCompanyService')
const gradeService = require('./gradeService')
const settingService = require('./settingService')
const mobileTeamUserService = require('./mobileTeamUserService')
const mobileTeamService = require('./mobileTeamService')
const teamUserService = require('./mobileTeamUserService')
const fileService = require('./fileService')
const ModuleNameEnum = require('../models/enum/ModuleNameEnum')
const { raw } = require('objection')
const { UniqueViolationError } = require('objection');
const Team = require('../models/Team')
const TeamUserMapping = require('../models/TeamUserMapping')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const ThreadPostReply = require('../models/ThreadPostReply')
const ThreadPost = require('../models/ThreadPost')

const mobileForumService = {}

const ErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    USER_NOT_IN_TEAM: 'USER_NOT_IN_TEAM',
    FORBIDDEN_ACTION: 'FORBIDDEN_ACTION',
    THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
    INVALID_TYPE: 'INVALID_TYPE',
    NOT_ADMIN: 'NOT_ADMIN',
    TITLE_EXISTED: 'TITLE_EXISTED',
    PRIVATE_NOT_AVAILABLE: 'PRIVATE_NOT_AVAILABLE',
    FILE_NOT_EXIST: 'FILE_NOT_EXIST'
}

function isNameUniqueValidationError(e) {

    if (!e.nativeError)
        return false;

    return e.nativeError.detail.includes('ethreadtitle') && e instanceof UniqueViolationError
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
        throw new UnsupportedOperationError(ErrorEnum.INVALID_TYPE)

    // If team thread AND it is public, check whether it's made by an Admin
    if(threadDTO.eteameteamid && threadDTO.ethreadispublic)
        await teamUserService.getTeamUserCheckAdmin(threadDTO.eteameteamid, user.sub);

    if( threadDTO.ecompanyecompanyid ) {

        await mobileCompanyService.checkUserInCompany(threadDTO.ecompanyecompanyid, user.sub)
            .then(userInCompany => {
                if(!userInCompany) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
            })

        if (threadDTO.ethreadispublic) {

            const isAllowed = await gradeService.getAllGradesByUserIdAndCompanyId(threadDTO.ecompanyecompanyid, user.sub)
                .then(grades => grades.map(grade => grade.egradeid))
                .then(gradeIds => settingService.isUserHaveFunctions(['P'], gradeIds, ModuleNameEnum.FORUM, threadDTO.ecompanyecompanyid))

            if (!isAllowed) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)
        }

    }

    if (threadDTO.efileefileid) {
        const file = await fileService.getFileById(threadDTO.efileefileid)
        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_EXIST)
    }

    return Thread.transaction(async trx => {
        
            const thread = await Thread.query(trx)
                .insertToTable(threadDTO, user.sub)

            const moderator = await ThreadModerator.query(trx)
                .insertToTable({ethreadethreadid: thread.ethreadid, eusereuserid: user.sub});

            return Promise.resolve({ thread, moderator });

    }).catch(e => {
        if (isNameUniqueValidationError(e)) throw new UnsupportedOperationError(ErrorEnum.TITLE_EXISTED)
        throw e
    })
    
}

mobileForumService.updateThreadById = async (threadId, threadDTO, user) => {
    
    const thread = await mobileForumService.getThreadById(threadId);

    const moderator = await mobileForumService.isModerator(thread.ethreadid, user.sub)

    if(!moderator) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION);

    // If user made the thread, cannot be private
    if(!thread.eteameteamid && !thread.ecompanyecompanyid && !threadDTO.ethreadispublic)
        throw new UnsupportedOperationError(ErrorEnum.PRIVATE_NOT_AVAILABLE);

    // If team thread AND it is public, check whether it's made by an Admin
    if(thread.eteameteamid && thread.ethreadispublic)
        await teamUserService.getTeamUserCheckAdmin(thread.eteameteamid, user.sub);

    if(thread.ecompanyecompanyid && thread.ethreadispublic) {

        await mobileCompanyService.checkUserInCompany(thread.ecompanyecompanyid, user.sub)
            .then(userInCompany => {
                if(!userInCompany) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_IN_COMPANY)
            });

        const isAllowed = await gradeService.getAllGradesByUserIdAndCompanyId(thread.ecompanyecompanyid, user.sub)
            .then(grades => grades.map(grade => grade.egradeid))
            .then(gradeIds => settingService.isUserHaveFunctions(['P'], gradeIds, ModuleNameEnum.FORUM, thread.ecompanyecompanyid))

        if (!isAllowed) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION)
        
    }

    if (threadDTO.efileefileid) {
        const file = await fileService.getFileById(threadDTO.efileefileid)
        if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_EXIST)
    }

    return thread
        .$query()
        .updateByUserId(threadDTO, user.sub)
        .returning('*')
        .catch(e => {
            if (isNameUniqueValidationError(e)) throw new UnsupportedOperationError(ErrorEnum.TITLE_EXISTED)
            throw e
        })
    
}

mobileForumService.getThreadList = async (page, size, filter, isPublic, keyword) => {
    
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
        .where(raw('lower(ethreadtitle)'), 'like', `%${keyword.toLowerCase()}%`)
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
    .withGraphFetched('threadPicture(baseAttributes)')
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
            if(!thread) throw new UnsupportedOperationError(ErrorEnum.THREAD_NOT_FOUND);
            return thread;
        });

}

mobileForumService.deleteThreadById = async (threadId, user) => {

    const moderator = await mobileForumService.isModerator(threadId, user.sub)

    if(!moderator) throw new UnsupportedOperationError(ErrorEnum.FORBIDDEN_ACTION);

    return mobileForumService.getThreadById(threadId)
        .then(thread => {
            thread.$query()
                .del()
                .then(rowsAffected => rowsAffected === 1);
        });

}

mobileForumService.getUserOrganizationListWithPermission = async (page, size, keyword, type, user) => {

    if (type === 'PUBLIC') {
        const myCompaniesPage = await mobileCompanyService.getMyCompanies(page, Number.MAX_SAFE_INTEGER, keyword, user)
        let myCompanies = myCompaniesPage.data
        const promises = []
        myCompanies.forEach(company => {
            const promise = gradeService.getAllGradesByUserIdAndCompanyId(company.ecompanyid, user.sub)
                .then(grades => grades.map(grade => grade.egradeid))
                .then(gradeIds => settingService.isUserHaveFunctions(['P'], gradeIds, ModuleNameEnum.FORUM, company.ecompanyid))
                .then(result => result ? company.ecompanyid : null)
            promises.push(promise)
        })
        const myCompanyIds = await Promise.all(promises).then(companyIds => companyIds.filter(company => !!company))
        myCompanies = myCompanies.filter(company => myCompanyIds.indexOf(company.ecompanyid) !== -1)
        let newCompanies = myCompanies
        if (myCompanies.length > (page * size)) {
            newCompanies = []
            for (let i = page * size; i < myCompanies.length; i++) {
                newCompanies.push(myCompanies[i])
            }
        }
        myCompaniesPage.data = newCompanies
        myCompaniesPage.paging.size = size
        myCompaniesPage.paging.totalSize = myCompanies.length
        return myCompaniesPage
    }

    return mobileCompanyService.getMyCompanies(page, size, keyword, user)
}

mobileForumService.getUserTeamListWithAdminStatus = async (page, size, keyword, type, user) => {

    if (type === 'PUBLIC') {
        const myTeamsPage = await mobileTeamService.getMyTeams(page, Number.MAX_SAFE_INTEGER, keyword, user)
        let myTeams = myTeamsPage.data
        const myTeamIds = myTeams.map(team => team.eteamid)
        const adminTeamIds = await mobileTeamUserService.checkAdminOnTeamIds(myTeamIds, user.sub)
        myTeams = myTeams.filter(team => adminTeamIds.indexOf(team.eteamid) !== -1)
        let newTeams = myTeams
        if (myTeams.length > (page * size)) {
            newTeams = []
            for (let i = page * size; i < myTeams.length; i++) {
                newTeams.push(myTeams[i])
            }
        }
        myTeamsPage.data = newTeams
        myTeamsPage.paging.size = size
        myTeamsPage.paging.totalSize = myTeams.length
        return myTeamsPage
    }

    return mobileTeamService.getMyTeams(page, size, keyword, user)
}

mobileForumService.getMyThreadList = async (page, size, keyword, user) => {

    const commentIds = await ThreadPostReply.query()
        .where('ethreadpostreplycreateby', user.sub)
        .then(replies => replies.filter(reply => reply.ecommentecommentid).map(reply => reply.ecommentecommentid));

    const threadIds = await ThreadPost.query()
        .where('ethreadpostcreateby', user.sub)
        .orWhereIn('ethreadpostid', commentIds)
        .then(comments => comments.filter(comment => comment.ethreadethreadid).map(comment => comment.ethreadethreadid));

    const teamIds = await TeamUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(teams => teams.filter(team => team.eteamid).map(team => team.eteamid));

    const companyIds = await CompanyUserMapping.query()
        .where('eusereuserid', user.sub)
        .then(companies => companies.filter(company => company.ecompanyid).map(company => company.ecompanyid));

    return Thread.query()
        .modify('baseAttributes')
        .whereRaw(`LOWER("ethreadtitle") LIKE LOWER('%${keyword}%')`)
        .where('ethreadcreateby', user.sub)
        .orWhereIn('eteameteamid', teamIds)
        .orWhereIn('ecompanyecompanyid', companyIds)
        .orWhereIn('ethreadid', threadIds)
        .page(page, size)
        .then(threads => ServiceHelper.toPageObj(page, size, threads));

}

module.exports = mobileForumService