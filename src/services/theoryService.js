const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const CompanyUserMapping = require('../models/CompanyUserMapping');
const CompanyFileMapping = require('../models/CompanyFileMapping');
const fileService = require('../services/fileService')

const theoryService = {};

const UnsupportedOperationErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    FILE_NOT_EXIST: 'FILE_NOT_EXIST'
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

// check if the file exists in company
theoryService.fileInCompanyExist = async (fileId, companyId) => {

    return CompanyFileMapping.query()
    .where('ecompanyecompanyid', companyId)
    .where('efileefileid', fileId)
    .first()
    .then(file => {
        if(!file) return false
        return true
    })

}

theoryService.createTheory = async ( file, user ) => {

    return CompanyFileMapping.transaction(async trx => {

        const uploadedTheory = await fileService.createFileWithTransaction(trx, file, user)

        const mappingDTO = {
            ecompanyecompanyid: user.companyId,
            efileefileid: uploadedTheory.efileid
        }

        return CompanyFileMapping.query(trx)
        .insertToTable(mappingDTO, user.sub)
    })

}

theoryService.downloadTheory = async (fileId, companyId, user) => {

    const isUserInCompany = await theoryService.isUserInCompany(companyId, user);

    if (!isUserInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    const fileInCompany = await theoryService.fileInCompanyExist(fileId, companyId)

    if(!fileInCompany) 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return fileService.downloadFile(fileId)

}

theoryService.getTheoryList = async (keyword, page, size, companyId, user) => {

    const isUserInCompany = await theoryService.isUserInCompany(companyId, user);

    if (!isUserInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    return fileService.getFilesByCompanyId(page, size, companyId, keyword)

}

theoryService.previewTheory = async (fileId, companyId, user) => {

    const isUserInCompany = await theoryService.isUserInCompany(companyId, user);

    if (!isUserInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    const fileInCompany = await theoryService.fileInCompanyExist(fileId, companyId)

    if(!fileInCompany) 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return fileService.getFileById(fileId)
    .then(theory => {
        if(!theory) throw new NotFoundError()
        return theory
    })

}

theoryService.deleteTheoryByFileId = async (fileId, companyId, user) => {

    const isUserInCompany = await theoryService.isUserInCompany(companyId, user);

    if (!isUserInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    return fileService.deleteFileById(fileId)

}

module.exports = theoryService;