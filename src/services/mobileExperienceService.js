const Experience = require('../models/Experience')
const FileExperienceMapping = require('../models/FileExperienceMapping')
const ServiceHelper = require('../helper/ServiceHelper')
const { raw } = require('objection');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const fileService = require('../services/fileService')

const experienceService = {}

const UnsupportedOperationErrorEnum = {
    FILE_NOT_FOUND: 'FILE_NOT_FOUND'
}

experienceService.createExperience = async (experienceDTO, loggedInUser, fileId) => {

    let file 
    if( fileId !== 0 ) {
        
        file = await fileService.getFileByIdAndCreateBy(fileId, loggedInUser.sub)

        if(!file)
            throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_FOUND)

    }
  
    // insert file to mapping
    const experience = await Experience.query()
    .insertToTable(experienceDTO, loggedInUser.sub)

    // if file exist
    if(file) {
        await FileExperienceMapping.query()
        .insertToTable({
            efileefileid: fileId,
            eexperienceeexperienceid: experience.eexperienceid
        }, loggedInUser.sub)
    }

    return experience

}

experienceService.getExperienceList = async (page = 0, size = 10, loggedInUser, keyword) => {

    let newKeyword = ''

    if (keyword) newKeyword = keyword.toLowerCase()

    const pageObj = await Experience.query()
    .select()
    .where('eusereuserid', loggedInUser.sub)
    .where(raw('lower("eexperiencename")'), 'like', `%${newKeyword}%`)
    .page(page, size)


    return ServiceHelper.toPageObj(page, size, pageObj)
}

experienceService.getExperienceById = async (experienceId, loggedInUser) => {

    return Experience.query()
    .select('eexperienceid','eexperiencename', 'eexperiencestartdate', 'eexperienceenddate', 'eexperiencelocation', 
    'eexperienceposition', 'eexperiencedescription', 'eindustryname', 'efilename')
    .joinRelated('[industries, files]')
    .where('eexperienceid', experienceId)
    .first()

}

experienceService.editExperience = async (experienceDTO, experienceId, loggedInUser, fileIds) => {

    // remove file experience mapping by experienceid
    await FileExperienceMapping.query()
    .delete()
    .where('eexperienceeexperienceid', experienceId)

    if( fileIds !== undefined ) {
        const mapping = fileIds.map(fileId => ({
            efileefileid: fileId,
            eexperienceeexperienceid: experienceId
        }))
    
        // add file experience mapping
        await FileExperienceMapping.query()
        .insertToTable(mapping, loggedInUser.sub)
    }

    return Experience.query()
    .where('eexperienceid', experienceId)
    .where('eusereuserid', loggedInUser.sub)
    .first()
    .updateByUserId(experienceDTO, loggedInUser.sub)
    .returning('*')

}

experienceService.deleteExperience = async (experienceId, loggedInUser) => {

    return Experience.query()
    .delete()
    .where('eexperienceid', experienceId)
    .where('eusereuserid', loggedInUser.sub)
    .then(rowsAffected => rowsAffected === 1)

}

module.exports = experienceService