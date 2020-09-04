const Joi = require('joi')

const schema = Joi.object({
    userId: Joi.number().positive().required()
})

module.exports = schema