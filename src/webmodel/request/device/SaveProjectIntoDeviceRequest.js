const Joi = require('joi')

const schema = Joi.object({
    projectIds: Joi.array().items( Joi.number().positive() ).required()
})

module.exports = schema