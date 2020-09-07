const Joi = require('joi')

const schema = Joi.object({
    users: Joi.array().required().min(1).items(
        Joi.object({
            id: Joi.number().positive().required(),
            permission: Joi.number().positive().required(),
            deleted: Joi.boolean().required()
        })
    )
})

module.exports = schema