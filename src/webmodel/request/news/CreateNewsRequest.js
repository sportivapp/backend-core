const Joi = require('joi')

const schema = Joi.object({
    date: Joi.number().positive().required(),
    title: Joi.string().max(255).required(),
    content: Joi.string().min(1).required(),
    fileId: Joi.number().positive().allow(null),
})

module.exports = schema