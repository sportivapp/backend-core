const fileService = require('../services/fileService');
const companyUserService = require('../services/mobileCompanyUserService');

const theoryService = {};

theoryService.getFilesByCompanyId = async(page, size, keyword, companyId, user) => {

    await companyUserService.checkUserInCompany(user.sub, companyId);

    return fileService.getFilesByCompanyId(page, size, companyId, keyword)

}

module.exports = theoryService;