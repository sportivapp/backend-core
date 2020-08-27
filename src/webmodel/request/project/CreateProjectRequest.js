const Joi = require('joi')

const schema = Joi.object({
    code: Joi.string().max(255).required(),
    name: Joi.string().max(255).required(),
    startDate: Joi.number().required(),
    endDate: Joi.number().required(),
    address: Joi.string().max(255).required(),
    description: Joi.string().max(255).required(),
    parentId: Joi.number(),
})

module.exports = schema