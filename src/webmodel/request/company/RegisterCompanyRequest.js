const Joi = require('joi')

const schema = Joi.object({
    nik: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    companyName: Joi.string().required(),
    companyEmail: Joi.string().required(),
    street: Joi.string().required(),
    postalCode: Joi.number().positive().required()
})

module.exports = schema