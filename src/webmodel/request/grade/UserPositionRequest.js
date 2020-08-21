const Joi = require('joi')

const schema = Joi.object({
    userIds: Joi.array().required().min(1).items(Joi.number().positive().required()),
    positionId: Joi.number().positive().required()
})

module.exports = schema