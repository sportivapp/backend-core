const Joi = require('joi')

const schema = Joi.object({
    status: Joi.string().max(255).required(),
    permitId: Joi.number().positive().required()
})

module.exports = schema