const Joi = require('joi')

const schema = Joi.object({
    userId: Joi.number().positive().required(),
    positionIds: Joi.array().required().min(1).items(Joi.number().positive().required())
})

module.exports = schema