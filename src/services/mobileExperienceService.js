const Experience = require('../models/Experience')
const FileExperienceMapping = require('../models/FileExperienceMapping')
const ServiceHelper = require('../helper/ServiceHelper')

const experienceService = {}

experienceService.createExperience = async (experienceDTO, loggedInUser, fileIds) => {

    const experience = await Experience.query()
    .insertToTable(experienceDTO, loggedInUser.sub)

    const mapping = fileIds.map(fileId => ({
        efileefileid: fileId,
        eexperienceeexperienceid: experience.eexperienceid
    }))
    
    // insert file to mapping
    await FileExperienceMapping.query().insertToTable(mapping, loggedInUser.sub)

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

    return experience

}

experienceService.editExperience = async (experienceDTO, experienceId, loggedInUser) => {

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