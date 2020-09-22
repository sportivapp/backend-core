const Experience = require('../models/Experience')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const experienceService = {}

experienceService.getExperienceById = async (experienceId) => {

    return Experience.query()
    .findById(experienceId)
    .modify('baseAttributes')
    .leftJoinRelated('files')
    .select('efileid', 'efilename')
    .then(experience => {
        if(!experience)
            throw new NotFoundError()
        return experience
    })

}

module.exports = experienceService