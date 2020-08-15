const Joi = require('joi')

const schema = Joi.object({
    locationAccuracy: Joi.string().max(255).required(),
    absenTime: Joi.number().positive().required(),
    absenStatus: Joi.string().max(255).required(),
    absenDescription: Joi.string().max(255).required(),
    imageFile: Joi.binary().required(),
    imageType: Joi.number().positive().required(),
    deviceId: Joi.number().positive().required(),
    userId: Joi.number().positive().required()
})

module.exports = schema