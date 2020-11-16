const Joi = require('joi')

const schema = Joi.object({
    isPublish: Joi.boolean().required(),
    isScheduled: Joi.boolean().default(false),
    scheduleDate: Joi.number().default(null).allow(null)
})

module.exports = schema