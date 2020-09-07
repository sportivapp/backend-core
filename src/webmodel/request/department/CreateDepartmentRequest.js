const Joi = require('joi')

const schema = Joi.object({
    departmentName: Joi.string().max(255).required(),
    departmentDescription: Joi.string().max(255).required(),
    departmentSuperiorId: Joi.number().positive().allow(null)
})

module.exports = schema