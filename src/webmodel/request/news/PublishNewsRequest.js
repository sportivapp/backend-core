const Joi = require('joi')

const schema = Joi.object({
    isPublish: Joi.boolean().required()
})

module.exports = schema