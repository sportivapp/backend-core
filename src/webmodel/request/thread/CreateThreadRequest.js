const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    isPublic: Joi.boolean().required(),
    companyId: Joi.number().allow(null),
    teamId: Joi.number().allow(null),
    fileId: Joi.number().allow(null),
    moderatorIds: Joi.array().min(1).items(Joi.number().required())
})

module.exports = schema