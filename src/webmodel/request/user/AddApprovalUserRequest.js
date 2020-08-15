const Joi = require('joi')

const schema = Joi.object({
    request: Joi.object({
        userId: Joi.number().positive().required(),
        approvalUserIds: Joi.array().items(Joi.number().positive()).min(1).required(),
    })
})

module.exports = schema