const Joi = require('joi')

const schema = Joi.object({
    comment: Joi.string().required(),
    fileId: Joi.number().allow(null)
})

module.exports = schema