const Joi = require('joi')

const schema = Joi.object({
    companyId: Joi.number().positive().required(),
    departmentId: Joi.number().positive(),
    targetUserId: Joi.number().positive(),
    isMultiple: Joi.boolean().required(),
    userIds: Joi.array().min(1).required().items(Joi.number().positive())
})

module.exports = schema