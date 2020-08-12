const Joi = require('joi')

const schema = Joi.object({
    info: Joi.string().max(255).required(),
    imei: Joi.string().max(16).required()
})

module.exports = schema