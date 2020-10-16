const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    fileId: Joi.number().allow(null),
    isPublic: Joi.boolean().required(),
    lock: Joi.boolean().required(),
    moderatorIds: Joi.array().required().min(1).items(Joi.number().required())
})

module.exports = schema