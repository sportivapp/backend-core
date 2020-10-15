const Joi = require('joi')

const schema = Joi.object({
    companyName: Joi.string().required(),
    companyEmail: Joi.string().required(),
    street: Joi.string().required(),
    companyParentId: Joi.number().positive().allow(null),
    countryId: Joi.number().positive(),
    stateId: Joi.number().positive()
})

module.exports = schema