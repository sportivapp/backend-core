const Joi = require('joi')

const schema = Joi.object({
    rosterName: Joi.string().max(255).required(),
    rosterDescription: Joi.string().max(255).required(),
    supervisorId: Joi.number().required(),
    headUserId: Joi.number().required(),
    users: Joi.array().items(Joi.object({
        id: Joi.number().required(),
        jobDescription: Joi.string().max(255).required()
    }))
})

module.exports = schema