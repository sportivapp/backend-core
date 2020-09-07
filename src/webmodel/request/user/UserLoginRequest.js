const Joi = require('joi')

const schema = Joi.object({
    email: Joi.string().max(255).required(),
    password: Joi.string().required()
})

module.exports = schema