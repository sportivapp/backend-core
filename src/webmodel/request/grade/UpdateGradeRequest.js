const Joi = require('joi')

const schema = Joi.object({
    request: Joi.object({
        name: Joi.string().max(255).required(),
        description: Joi.string().max(255).required(),
        superiorId: Joi.number().positive().required()
    })
})

module.exports = schema