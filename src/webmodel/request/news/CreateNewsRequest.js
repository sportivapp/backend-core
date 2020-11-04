const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string().max(255).required(),
    content: Joi.string().min(1).required(),
    fileId: Joi.number().positive().allow(null),
    industryId: Joi.number().positive().required(),
    isPublic: Joi.boolean().required()
})

module.exports = schema