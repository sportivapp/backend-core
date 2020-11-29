const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string().max(255).allow(null, ''),
    content: Joi.string().allow(null, ''),
    fileId: Joi.number().positive().allow(null),
    industryId: Joi.number().positive().allow(null),
    isPublic: Joi.boolean().required()
})

module.exports = schema