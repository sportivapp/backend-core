const Joi = require('joi')

const schema = Joi.object({
    startTime: Joi.number().required(),
    endTime: Joi.number().required(),
    times: Joi.array().min(1).required().items(Joi.object({
        name: Joi.string().max(255).required(),
        startHour: Joi.number().required(),
        startMinute: Joi.number().required(),
        endHour: Joi.number().required(),
        endMinute: Joi.number().required()
    }))
})

module.exports = schema