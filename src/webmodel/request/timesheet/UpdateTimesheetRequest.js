const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(255).required(),
    rosterCount: Joi.number().required(),
    shiftId: Joi.number().required(),
    rosters: Joi.array().required().items(Joi.object({
        id: Joi.number().required(),
        name: Joi.string().max(255).required(),
        departmentId: Joi.number(),
        userLimit: Joi.number(),
        reserveLimit: Joi.number(),
    }))
})

module.exports = schema