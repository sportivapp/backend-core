const Joi = require('joi')

const schema = Joi.object({
    userId: Joi.number().positive().required(),
    description: Joi.string().max(255).required(),
    startDate: Joi.number().positive().required(),
    endDate: Joi.number().positive().required(),
})

module.exports = schema