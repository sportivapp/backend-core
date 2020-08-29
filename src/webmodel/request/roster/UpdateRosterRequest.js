const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255).required(),
    supervisorId: Joi.number(),
    headUserId: Joi.number(),
    departmentId: Joi.number()
})

module.exports = schema