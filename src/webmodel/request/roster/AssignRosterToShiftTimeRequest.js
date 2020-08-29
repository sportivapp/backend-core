const Joi = require('joi')

const schema = Joi.object({
    mappings: Joi.array().required().min(1).items( Joi.object({
        rosterId: Joi.number().required(),
        name: Joi.string().required(),
        shiftTimeId: Joi.number().required(),
        dayTime: Joi.number().required()
    }))
})

module.exports = schema