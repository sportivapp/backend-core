const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(65).required(),
    startDate: Joi.number().positive().required(),
    endDate: Joi.number().positive().allow(0),
    location: Joi.string().max(65),
    position: Joi.string().max(65),
    description: Joi.string().max(1025).allow('', null),
    industryId: Joi.number().positive().required()
})

module.exports = schema