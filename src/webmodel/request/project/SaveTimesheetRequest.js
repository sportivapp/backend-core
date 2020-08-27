const Joi = require('joi')

const schema = Joi.object({
    timesheetIds: Joi.array().items(Joi.number()).required().min(1)
})

module.exports = schema