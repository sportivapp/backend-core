const companyService = require('../companyService')
const companyLogService = require('../companyLogService')
const CompanyLogTypeEnum = require('../../models/enum/CompanyLogTypeEnum')

const companyUserService = {}

companyUserService.getUserCompanyListSummary = async (user) => {

    const myCompanyCount = companyService.getMyCompanyListCount(user)
        .then(result => result.count)
        .then(count => parseInt(count))

    const myCompanyRequestCount = companyLogService.getLogCountByTypeAndUser(CompanyLogTypeEnum.APPLY, user)
        .then(result => result.count)
        .then(count => parseInt(count))

    const myCompanyInviteCount = companyLogService.getLogCountByTypeAndUser(CompanyLogTypeEnum.INVITE, user)
        .then(result => result.count)
        .then(count => parseInt(count))

    return Promise.all([myCompanyCount, myCompanyRequestCount, myCompanyInviteCount])
        .then(([companyCount, requestCount, inviteCount]) => ({
            myCompanyCount: companyCount,
            companyRequestCount: requestCount,
            companyInviteCount: inviteCount
        }))
}

companyUserService.getMyCompanies = async (page, size, keyword, user) => {

    return companyService.getMyCompanyList(page, size, keyword, user)
}

companyUserService.getRequestedCompanies = async (page, size, keyword, user) => {

    return companyLogService.getCompanyListLogByUserId(user.sub, CompanyLogTypeEnum.APPLY, page, size, keyword)
}

companyUserService.getCompanyInvites = async (page, size, keyword, user) => {

    return companyLogService.getCompanyListLogByUserId(user.sub, CompanyLogTypeEnum.INVITE, page, size, keyword)
}

companyUserService.exitCompany = async (companyId, user) => {

    return companyLogService.exitCompany(companyId, user)
}

module.exports = companyUserService