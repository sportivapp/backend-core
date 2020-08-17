const Joi = require('joi')

const schema = Joi.object({
    companyName: Joi.string().required(),
    companyEmail: Joi.string().required(),
    street: Joi.string().required(),
    postalCode: Joi.number().positive().required(),
    companyParentId: Joi.number().positive().allow(null),
    companyOlderId: Joi.number().positive().allow(null)
})

module.exports = schema