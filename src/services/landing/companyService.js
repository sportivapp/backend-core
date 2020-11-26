const companyService = require('../companyService')
const companyLogService = require('../companyLogService')
const ServiceHelper = require('../../helper/ServiceHelper')
const CompanyLogTypeEnum = require('../../models/enum/CompanyLogTypeEnum')

const landingCompanyService = {}

landingCompanyService.getAllCompanies = async (page, size, keyword, categoryId) => {

    return companyService.getAllCompanies(page, size, keyword, categoryId)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))
}

landingCompanyService.getCompany = async (companyId, user) => {

    const company = companyService.getCompleteCompanyById(companyId)
    const isApplied = companyLogService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.APPLY])
    const isInvited = companyLogService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.INVITE])
    const isMember = companyService.isUserExistInCompany(companyId, user.sub)
    return Promise.all([company, isApplied, isInvited, isMember])
        .then(([company, isApplied, isInvited, isMember]) => ({
            ...company,
            isApplied: !!isApplied,
            isInvited: !!isInvited,
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