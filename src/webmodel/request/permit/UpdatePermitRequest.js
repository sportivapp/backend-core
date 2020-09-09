const Joi = require('joi')

const schema = Joi.object({
    description: Joi.string().max(255).required(),
    startDate: Joi.number().positive().required(),
    endDate: Joi.number().positive().required(),
})

module.exports = schema