const Experience = require('../models/Experience')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const experienceService = {}

experienceService.getExperienceById = async (experienceId) => {

    return Experience.query()
    .select('eexperienceid','eexperiencename', 'eexperiencestartdate', 'eexperienceenddate', 'eexperiencelocation', 
    'eexperienceposition', 'eexperiencedescription', 'eindustryname', 'efileid', 'efilename')
    .leftJoinRelated('[industry, files]')
    .where('eexperienceid', experienceId)
    .first()
    .then(experience => {
        if(experience === undefined)
            throw new NotFoundError()
        return experience
    })

}

module.exports = experienceService