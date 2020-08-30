const Experience = require('../models/Experience')
const Industry = require('../models/Industry')
const ServiceHelper = require('../helper/ServiceHelper')

const experienceService = {}

experienceService.createExperience = async (experienceDTO, loggedInUser) => {

    return Experience.query().insertToTable(experienceDTO, loggedInUser.sub)

}

experienceService.getExperienceList = async (page, size, loggedInUser) => {

    if( isNaN(page) || isNaN(size) )
        return ServiceHelper.toEmptyPage(page, size)

    const pageObj = await Experience.query()
    .select()
    .where('eusereuserid', loggedInUser.sub)
    .page(page, size)

    return ServiceHelper.toPageObj(page, size, pageObj)
}

experienceService.getExperienceById = async (experienceId, loggedInUser) => {
    const experience = await Experience.query()
    .select()
    .where('eexperienceid', experienceId)
    .where('eusereuserid', loggedInUser.sub)
    .first()

    const industry = await Industry.query()
    .select()
    .where('eindustryid', experience.eindustryeindustryid)
    .first()

    const result = {
        ...experience,
        eindustryname: industry.eindustryname
    }

    return result

}

experienceService.editExperience = async (experienceDTO, experienceId, loggedInUser) => {

    return Experience.query()
    .updateByUserId(experienceDTO, loggedInUser.sub)
    .where('eexperienceid', experienceId)
    .where('eusereuserid', loggedInUser.sub)
    .returning('*')

}

experienceService.deleteExperience = async (experienceId, loggedInUser) => {

    return Experience.query()
    .delete()
    .where('eexperienceid', experienceId)
    .where('eusereuserid', loggedInUser.sub)
    .returning('*')
}

module.exports = experienceService