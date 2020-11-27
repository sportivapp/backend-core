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
    const companyLog = companyLogService.getPendingLog(companyId, user.sub, [CompanyLogTypeEnum.APPLY, CompanyLogTypeEnum.INVITE])
    const isMember = companyService.isUserExistInCompany(companyId, user.sub)
    return Promise.all([company, companyLog, isMember])
        .then(([company, companyLog, isMember]) => ({
            ...company,
            isApplied: CompanyLogTypeEnum.APPLY === companyLog.ecompanylogtype,
            isInvited: CompanyLogTypeEnum.INVITE === companyLog.ecompanylogtype,
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