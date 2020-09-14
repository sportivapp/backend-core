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

experienceService.getExperienceById = async (experienceId) => {

    return Experience.query()
    .select('eexperienceid','eexperiencename', 'eexperiencestartdate', 'eexperienceenddate', 'eexperiencelocation', 
    'eexperienceposition', 'eexperiencedescription', 'eindustryname', 'efileid', 'efilename')
    .leftJoinRelated('[industries, files]')
    .where('eexperienceid', experienceId)
    .first()

}

experienceService.editExperience = async (experienceDTO, experienceId, loggedInUser, fileId) => {

    const experience = await experienceService.getExperienceById(experienceId);

    if (!experience)
        throw new NotFoundError()

    let promises = []

    // remove previous file, so when edit file to 'no file', file already deleted
    await FileExperienceMapping.query()
    .delete()
    .where('eexperienceeexperienceid', experienceId)

    let file 

    if( fileId !== 0 ) {
        
        file = await fileService.getFileByIdAndCreateBy(fileId, loggedInUser.sub)

        if(!file)
            throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.FILE_NOT_FOUND)

    }

    if(file) {
        promises.push( 
            FileExperienceMapping.query()
            .insertToTable({
                efileefileid: fileId,
                eexperienceeexperienceid: experienceId
            }, loggedInUser.sub)
        ) 
    }

    promises.push(
        Experience.query()
        .where('eexperienceid', experienceId)
        .where('eusereuserid', loggedInUser.sub)
        .first()
        .updateByUserId(experienceDTO, loggedInUser.sub)
        .returning('*')
    )

    return Promise.all(promises)
    .then(arr => {
        // if promises length = 1, it means no FileExperienceMapping promise pushed
        if(promises.length === 1)
            return arr[0]
        return arr[1]
    })

}

experienceService.deleteExperience = async (experienceId, loggedInUser) => {

    return Experience.query()
    .delete()
    .where('eexperienceid', experienceId)
    .where('eusereuserid', loggedInUser.sub)
    .then(rowsAffected => rowsAffected === 1)

}

module.exports = experienceService