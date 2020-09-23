const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const { raw } = require('objection');
const File = require('../models/File');
const CompanyUserMapping = require('../models/CompanyUserMapping');

const theoryService = {};

const UnsupportedOperationErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY'
}

theoryService.isUserInCompany = async (companyId, user) => {

    return CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .andWhere('eusereuserid', user.sub)
    .first()
    .then(result => {
        if (!result)
            return false
        return true
    })

}

theoryService.getTheoryList = async (keyword, page, size, companyId, user) => {

    const isUserInCompany = await theoryService.isUserInCompany(companyId, user);

    if (!isUserInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    return File.query()
    .joinRelated('companyMappings')
    .where('ecompanyecompanyid', companyId)
    .andWhere(raw('lower("efilename")'), 'like', `%${keyword.toLowerCase()}%`)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));

}

module.exports = theoryService;