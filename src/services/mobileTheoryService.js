const fileService = require('../services/fileService');
const companyUserService = require('../services/mobileCompanyUserService');
const ServiceHelper = require('../helper/ServiceHelper');

const theoryService = {};

theoryService.getFilesByCompanyId = async(page, size, keyword, companyId, user) => {

    if (!companyId)
        return ServiceHelper.toEmptyPage(page, size)

    await companyUserService.checkUserInCompany(user.sub, companyId);

    return fileService.getFilesByCompanyId(page, size, companyId, keyword)

}

module.exports = theoryService;