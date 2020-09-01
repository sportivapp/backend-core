require('dotenv').config();
const fs = require('fs');
const util = require('util');
const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
const File = require('../models/File');

const FileService = {};

FileService.createFile = async (file, user) => {

    const fileDTO = {
        efilename: file.filename,
        efilepath: file.path,
        efiletype: file.mimetype
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

    return uploadFiles

}

FileService.moveFile = async (file, newPathDir, deleteDirectory = true, isMultiple = false) => {

    const newPathDirFull = process.env.UPLOADS_DIRECTORY + newPathDir;
    const newPathFull = process.env.UPLOADS_DIRECTORY + newPathDir + '/' + file.efilename;

    try {

        // Try to access path
        await access(newPathDirFull);

        if (deleteDirectory === true)
            await unlink(newPathDirFull);

    } catch(e) {

        // if path doesn't exist, create
        await mkdir(newPathDirFull, {recursive: true});

    }

    if(!isMultiple) {
        // Move uploaded file to movePath
        await rename(file.efilepath, newPathFull)
        .then(ignored => {
            file.efilepath = newPathFull
            return File.query().patchAndFetchById(file.efileid, file)
        })

    } else {
        let newFiles = []
        for(let i = 0; i < file.length ; i++) {

            let newFilePathFull = process.env.UPLOADS_DIRECTORY + newPathDir + '/' + file[i].efilename;

            newFiles.push(
                rename(file[i].efilepath, newPathFull)
                .then(ignored => {
                    file[i].efilepath = newFilePathFull
                    return File.query().patchAndFetchById(file[i].efileid, file[i])
                })
            )
        }

        await Promise.all(newFiles)

    }


}

FileService.getFileByIdAndCreateBy = async (fileId, createBy) => {

    return File.query().where('efileid', fileId).andWhere('efilecreateby', createBy).first();

}

FileService.getFileById = async (fileId) => {

    return File.query().where('efileid', fileId).first();

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