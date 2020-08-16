const Joi = require('joi')

const schema = Joi.object({
    companyName: Joi.string().required(),
    companyEmail: Joi.string().required(),
    street: Joi.string().required(),
    postalCode: Joi.number().positive().required(),
    companyParentId: Joi.number(),
    companyOlderId: Joi.number()
})

module.exports = schema