const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255),
    supervisorId: Joi.number(),
    headUserId: Joi.number()
})

module.exports = schema