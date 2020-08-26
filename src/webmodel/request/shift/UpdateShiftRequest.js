const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(255).required(),
    startDate: Joi.number().required(),
    endDate: Joi.number().required()
})

module.exports = schema