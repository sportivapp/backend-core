const Joi = require('joi')

const schema = Joi.object({
    newPassword: Joi.string().max(255).required()
})

module.exports = schema