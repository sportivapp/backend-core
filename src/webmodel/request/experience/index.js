const { routes } = require('../../../constant')
const CreateExperienceRequest = require('./CreateExperienceRequest')
const UpdateExperienceRequest = require('./UpdateExperienceRequest')

const experienceSchemas = {}

experienceSchemas[routes.experience.list] = CreateExperienceRequest
experienceSchemas[routes.experience.id] = UpdateExperienceRequest

module.exports = experienceSchemas