const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string().max(255),
    content: Joi.string().min(1),
    fileId: Joi.number().positive().allow(null),
    industryId: Joi.number().positive(),
    isPublic: Joi.boolean().required()
})

module.exports = schema