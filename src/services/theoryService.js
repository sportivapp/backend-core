const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const CompanyUserMapping = require('../models/CompanyUserMapping');
const CompanyFileMapping = require('../models/CompanyFileMapping');
const fileService = require('../services/fileService')

const theoryService = {};

const UnsupportedOperationErrorEnum = {
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY',
    FILE_NOT_EXIST: 'FILE_NOT_EXIST'
}

// check if user in company
theoryService.userInCompany = async (userId, companyId) => {

    return CompanyUserMapping.query()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', userId)
    .first()
    .then(user => {
        if(!user) return false
        return true
    })

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

theoryService.createTheory = async ( fileId, user ) => {

    const fileMaker = await fileService.getFileByIdAndCreateBy(fileId, user.sub)

    if(!fileMaker) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return CompanyFileMapping.transaction(async trx => {

        const mappingDTO = {
            ecompanyecompanyid: user.companyId,
            efileefileid: fileId
        }

        return CompanyFileMapping.query(trx)
        .insertToTable(mappingDTO, user.sub)
    })

}

theoryService.downloadTheory = async (theoryId, user) => {

    const fileInCompany = await theoryService.fileInCompanyExist(theoryId, user.companyId)

    if(!fileInCompany) 
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return fileService.getFileById(theoryId)

}

theoryService.getTheoryList = async (keyword, page, size, user) => {

    const userInCompany = await theoryService.userInCompany(user.sub, user.companyId)

    if(!userInCompany) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_IN_COMPANY)

    return fileService.getFilesByCompanyId(page, size, user.companyId, keyword)

}

theoryService.previewTheory = async (theoryId, user) => {

    const fileInCompany = await theoryService.fileInCompanyExist(theoryId, user.companyId)

    if(!fileInCompany)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return fileService.getFileById(theoryId)
    .then(theory => {
        if(!theory) throw new NotFoundError()
        return theory
    })

}

theoryService.deleteTheoryByFileId = async (theoryId, user) => {

    const fileMaker = await fileService.getFileByIdAndCreateBy(theoryId, user.sub)

    if(!fileMaker) throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_EXIST)

    return fileService.deleteFileById(theoryId)

}

module.exports = theoryService;