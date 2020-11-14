const Joi = require('joi')

const schema = Joi.object({
    isPublish: Joi.boolean().required(),
    isScheduled: Joi.boolean().required(),
    scheduleDate: Joi.number().allow(null)
})

module.exports = schema