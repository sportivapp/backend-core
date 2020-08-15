const Joi = require('joi')

const schema = Joi.object({
    rosterName: Joi.string().max(255).required(),
    rosterDescription: Joi.string().max(255).required(),
    projectId: Joi.number().required(),
    supervisorId: Joi.number().required(),
    headUserId: Joi.number().required(),
    userIds: Joi.array().items( Joi.number().positive()).required()
})

module.exports = schema