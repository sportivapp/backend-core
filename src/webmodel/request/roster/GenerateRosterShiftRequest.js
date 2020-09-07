const Joi = require('joi')

const schema = Joi.object({
    hourType: Joi.string().required(),
    formation: Joi.string().required(),
    rosterId: Joi.number().positive().required(),
    date: Joi.date().required(),
})

module.exports = schema