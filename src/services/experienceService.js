const Experience = require('../models/Experience')
const CompanyUserMapping = require('../models/CompanyUserMapping')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const experienceService = {}

experienceService.getExperienceById = async (experienceId, userId, user) => {

    const userInCompany = CompanyUserMapping.query()
    .where('ecompanyecompanyid', user.companyId)
    .where('eusereuserid', userId)
    .first()

    if(!userInCompany)
        throw new NotFoundError()

    return Experience.query()
    .findById(experienceId)
    .where('eexperiencecreateby', userId)
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