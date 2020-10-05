require('dotenv').config();
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);
const File = require('../models/File');
const { raw } = require('objection');
const { NotFoundError } = require('../models/errors')
const ServiceHelper = require('../helper/ServiceHelper')

const FileService = {};

FileService.checkFileMaker = async (fileId, user) => {
    
    return File.query()
    .findById(fileId)
    .where('efilecreateby', user.sub)
    .then(file => {
        if(!file) return false
        return true
    })
    
}

FileService.createFile = async (file, user) => {

    const fileDTO = {
        efilename: file.filename,
        efilepath: file.path,
        efiletype: file.mimetype,
        efilesize: file.size
    }
    
    return File.query().insertToTable(fileDTO, user.sub);

}

FileService.createMultipleFiles = async (files, user) => {

    const fileDTOs = files.map(file => ({
        efilename: file.filename,
        efilepath: file.path,
        efiletype: file.mimetype
    }))

    const uploadFiles = await File.query()
    .insertToTable(fileDTOs, user.sub)
    .then(uploadFile => {
        return uploadFile.map(file => {
            return file.efileid
        })
    })

    return uploadFiles

}

FileService.getFilesByCompanyId = async (page, size, companyId, keyword) => {

    return File.query()
    .joinRelated('companyMappings')
    .where('ecompanyecompanyid', companyId)
    .andWhere(raw('lower("efilename")'), 'like', `%${keyword.toLowerCase()}%`)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));

}

FileService.getFileByIdAndCreateBy = async (fileId, createBy) => {

    return File.query().where('efileid', fileId).andWhere('efilecreateby', createBy).first();

}

FileService.getFileById = async (fileId) => {

    return File
    .query()
    .findById(fileId)
    .then(file => {
        if(!file) throw new NotFoundError()
        return file
    })

}

FileService.deleteFileByIdAndCreateBy = async (fileId, createBy) => {

    const file = await FileService.getFileByIdAndCreateBy(fileId, createBy);

    if (!file)
        return
    
    await File.query().where('efileid', file.efileid).del();
    await unlink(file.efilepath);

    return;
    
}

FileService.deleteFileById = async (fileId) => {

    const file = await FileService.getFileById(fileId);

    if (!file)
        return
    
    await File.query().where('efileid', file.efileid).del();
    await unlink(file.efilepath);

    return;
    
}

module.exports = FileService;