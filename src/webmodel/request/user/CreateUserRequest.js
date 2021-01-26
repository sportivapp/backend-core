const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(255).required(), 
    email: Joi.string().max(255).required(),
    mobileNumber: Joi.string().required(),
    password: Joi.string().required(),
    otpCode: Joi.string().required(),
})

module.exports = schema