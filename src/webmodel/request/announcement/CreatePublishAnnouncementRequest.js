const Joi = require('joi')

const schema = Joi.object({
    userIds: Joi.array().items( Joi.number().positive() ).required(),
})

module.exports = schema