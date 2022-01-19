const Joi = require('joi')

const schema = Joi.object({
    title: Joi.string().max(255).required(),
    description: Joi.string(),
    categories: Joi.array().items(Joi.object({
        title: Joi.string().max(255).required(),
        description: Joi.string(),
        isRecurring: Joi.bool().required(),
        price: Joi.number().min(0).when('isRecurring', { is: true, then: Joi.required(), otherwise: Joi.disallow() }),
        sessions: Joi.array().when('isRecurring', {
            is: false,
            then: Joi.array().items(Joi.object({
                startDate: Joi.number().required(),
                endDate: Joi.number().required(),
                price: Joi.number().min(0).required()
            })),
            otherwise: Joi.array().items(Joi.object({
                startDate: Joi.number().required(),
                endDate: Joi.number().required()
            }))
        })
    }))
})

module.exports = schema