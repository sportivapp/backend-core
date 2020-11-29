const threadPostReplyService = require('./threadPostReplyService')
const mobileCommentService = require('./mobileCommentService')
const mobileForumService = require('./mobileForumService')
const mobileTeamUserService = require('./mobileTeamUserService')
const mobileCompanyUserService = require('./mobileCompanyUserService')
const myForumService = {}

myForumService.getMyThreadList = async (page, size, keyword, user) => {

    const threadPostIds = await threadPostReplyService.getThreadPostIdsByUserId(user.sub);

    const threadIds = mobileCommentService.getThreadIdsByUserIdAndThreadPostIds(user.sub, threadPostIds)

    const teamIds = mobileTeamUserService.getTeamIdsByUserId(user.sub);

    const companyIds = mobileCompanyUserService.getCompanyIdsByUserId(user.sub);

    return Promise.all([threadIds, teamIds, companyIds])
        .then(([foundThreadIds, foundTeamIds, foundCompanyIds]) => {
            const filter = { threadIds: foundThreadIds, teamIds: foundTeamIds, companyIds: foundCompanyIds }
            return mobileForumService.getMyThreadList(page, size, keyword, user, filter)
        })

}

module.exports = myForumService