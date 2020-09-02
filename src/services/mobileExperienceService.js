const Experience = require('../models/Experience')
const FileExperienceMapping = require('../models/FileExperienceMapping')
const ServiceHelper = require('../helper/ServiceHelper')
const fileService = require('../services/mobileFileService')

const experienceService = {}

experienceService.createExperience = async (experienceDTO, loggedInUser, files) => {

    const experience = await Experience.query()
    .insertToTable(experienceDTO, loggedInUser.sub)

    if( files !== undefined ) {
        const mapping = files.map(file => ({
            efileefileid: file.efileid,
            eexperienceeexperienceid: experience.eexperienceid
        }))
        
        // insert file to mapping
        await FileExperienceMapping.query().insertToTable(mapping, loggedInUser.sub)
    }


    return experience

}

experienceService.getExperienceList = async (page, size, loggedInUser) => {

    if( isNaN(page) || isNaN(size) ) {
        page = 0
        size = 10
    }

    const pageObj = await Experience.query()
    .select()
    .where('eusereuserid', loggedInUser.sub)
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

experienceService.editExperience = async (experienceDTO, experienceId, loggedInUser, files) => {

    // remove file experience mapping by experienceid
    await FileExperienceMapping.query()
    .delete()
    .where('eexperienceeexperienceid', experienceId)

    const mapping = files.map(file => ({
        efileefileid: file.efileid,
        eexperienceeexperienceid: experienceId
    }))

    // add file experience mapping
    await FileExperienceMapping.query()
    .insertToTable(mapping, loggedInUser.sub)

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