const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(65).required(),
    startDate: Joi.number().positive().required(),
    endDate: Joi.number().allow(null),
    location: Joi.string().max(65),
    position: Joi.string().max(65),
    description: Joi.string().max(1025),
    industryId: Joi.number().positive().required()
})

module.exports = schema