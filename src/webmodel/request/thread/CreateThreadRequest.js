const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().max(1025).required(),
    isPublic: Joi.boolean().required(),
    companyId: Joi.number().allow(null),
    teamId: Joi.number().allow(null),
    fileId: Joi.number().allow(null),
})

module.exports = schema