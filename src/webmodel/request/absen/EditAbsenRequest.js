const Joi = require('joi')

const schema = Joi.object({
    locationAccuracy: Joi.string().max(255).required(),
    absenStatus: Joi.string().max(255).required(),
    absenDescription: Joi.string().max(255).required()
})

module.exports = schema