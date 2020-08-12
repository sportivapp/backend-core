const Joi = require('joi')

const schema = Joi.object({
    departmentName: Joi.string().max(255).required(),
    departmentDescription: Joi.string().max(255).required(),
    departmentSuperiorId: Joi.number().required()
})

module.exports = schema