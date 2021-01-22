const Joi = require('joi')

const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    dob: Joi.number().required(),
    userMobileNumber: Joi.string().min(10).required(),
    address: Joi.string().required(),
    cityId: Joi.number().required(),
})

module.exports = schema