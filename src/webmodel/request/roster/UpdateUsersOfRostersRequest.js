const Joi = require('joi')

const schema = Joi.object({
    rosters: Joi.array().min(1).items(Joi.object({
        id: Joi.number().required(),
        users: Joi.array().items(Joi.object({
            name: Joi.string().max(255).required(),
            id: Joi.number(),
            jobDescription: Joi.string().max(255)
        }))
    }))
})

module.exports = schema