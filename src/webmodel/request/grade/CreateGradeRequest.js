const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(255).required(),
    companyId: Joi.number().positive().required(),
    superiorId: Joi.number().positive()
})

module.exports = schema