const companyService = require('../companyService')
const companyLogService = require('../companyLogService')
const companyUserMappingService = require('../companyUserMappingService')
const ServiceHelper = require('../../helper/ServiceHelper')
const CompanyLogTypeEnum = require('../../models/enum/CompanyLogTypeEnum')

const landingCompanyService = {}

landingCompanyService.getAllCompanies = async (page, size, keyword, categoryId, user) => {

    let excludedCompanyIds = []

    if (user) {

        const joinedCompanyIds = companyUserMappingService.getAllCompanyByUserId(user.sub)
            .then(mappings => mappings.map(mapping => mapping.ecompanyecompanyid))

        const companyIdsFromLog = companyLogService.getListPendingByTypesAndUserId(user.sub, [CompanyLogTypeEnum.APPLY, CompanyLogTypeEnum.INVITE])
            .then(logs => logs.map(log => log.ecompanyecompanyid))

        excludedCompanyIds = await Promise.all([joinedCompanyIds, companyIdsFromLog])
            .then(([joinedCompanies, companyIdsFromLog]) => excludedCompanyIds.concat(joinedCompanies).concat(companyIdsFromLog))
    }

    return companyService.getAllCompanies(page, size, keyword, categoryId, excludedCompanyIds)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

landingCompanyService.getCompany = async (companyId, user) => {

    const company = companyService.getCompleteCompanyById(companyId)
    let companyLog = null
    let isMember = false
    if (user) {
        companyLog = companyLogService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.APPLY, CompanyLogTypeEnum.INVITE])
        isMember = companyService.isUserExistInCompany(companyId, user.sub)
    }
    return Promise.all([company, companyLog, isMember])
        .then(([company, companyLog, isMember]) => ({
            ...company,
            isApplied: !!companyLog && CompanyLogTypeEnum.APPLY === companyLog.ecompanylogtype,
            isInvited: !!companyLog && CompanyLogTypeEnum.INVITE === companyLog.ecompanylogtype,
            isMember: !!isMember
        }))
}

landingCompanyService.joinCompany = async (companyId, user) => {

    return companyLogService.joinCompany(companyId, user)
}

landingCompanyService.getUsersInCompany = async (page, size, companyId, keyword) => {

    return companyService.getUsersByCompanyId(companyId, page, size, keyword)
}

landingCompanyService.createCompany = async(companyDTO, addressDTO, industryIds, user) => {

    return companyService.createCompany(companyDTO, addressDTO, industryIds, user)
}

module.exports = landingCompanyService