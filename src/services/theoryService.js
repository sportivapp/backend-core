const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const CompanyUserMapping = require('../models/CompanyUserMapping');
const CompanyFileMapping = require('../models/CompanyFileMapping');
const fileService = require('../services/fileService')

const theoryService = {};

const UnsupportedOperationErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    FILE_NOT_EXIST: 'FILE_NOT_EXIST'
}

// check if the file exists in company
theoryService.fileInCompanyExist = async (theoryId, companyId) => {

    return CompanyFileMapping.query()
    .where('ecompanyecompanyid', companyId)
    .where('efileefileid', theoryId)
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

theoryService.downloadTheory = async (theoryId, companyId, user) => {

    if (companyId !== user.companyId)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    const fileInCompany = await theoryService.fileInCompanyExist(theoryId, companyId)

    if(!fileInCompany) 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return fileService.getFileById(theoryId)

}

theoryService.getTheoryList = async (keyword, page, size, companyId, user) => {

    if (companyId !== user.companyId)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    return fileService.getFilesByCompanyId(page, size, companyId, keyword)

}

theoryService.previewTheory = async (theoryId, companyId, user) => {

    if (companyId !== user.companyId)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    const fileInCompany = await theoryService.fileInCompanyExist(theoryId, companyId)

    if(!fileInCompany) 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return fileService.getFileById(theoryId)
    .then(theory => {
        if(!theory) throw new NotFoundError()
        return theory
    })

}

theoryService.deleteTheoryByFileId = async (theoryId, companyId, user) => {

    if (companyId !== user.companyId)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY);

    return fileService.deleteFileById(theoryId)

}

module.exports = theoryService;