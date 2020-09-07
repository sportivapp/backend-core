const Experience = require('../models/Experience')
const FileExperienceMapping = require('../models/FileExperienceMapping')
const ServiceHelper = require('../helper/ServiceHelper')
const fileService = require('../services/fileService')
const { raw } = require('objection');

const experienceService = {}

experienceService.createExperience = async (experienceDTO, loggedInUser, fileIds) => {

    const experience = await Experience.query()
    .insertToTable(experienceDTO, loggedInUser.sub)

    if( fileIds !== undefined ) {
        const mapping = fileIds.map(fileId => ({
            efileefileid: fileId,
            eexperienceeexperienceid: experience.eexperienceid
        }))
        
        // insert file to mapping
        await FileExperienceMapping.query().insertToTable(mapping, loggedInUser.sub)
    }

    return experience

}

experienceService.getExperienceList = async (page =0, size = 10, loggedInUser, keyword) => {

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

    const experience = await Experience.query()
    .select('eexperienceid','eexperiencename', 'eexperiencestartdate', 'eexperienceenddate', 'eexperiencelocation', 'eexperienceposition', 'eexperiencedescription', 'eindustryname')
    .joinRelated('industries')
    .where('eexperienceid', experienceId)
    .where('eusereuserid', loggedInUser.sub)
    .first()

    const files = await FileExperienceMapping.query()
    .select('efileefileid')
    .where('eexperienceeexperienceid', experienceId)
    .where('efileexperiencemappingcreateby', loggedInUser.sub)

    const result = {
        ...experience,
        files
    }

    return result

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