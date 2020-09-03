const Joi = require('joi')

const schema = Joi.object({
    userNik: Joi.string().required(),
    username: Joi.string().max(255).required(),
    userMobileNumber: Joi.string().max(255).required(),
    isMultiApproval: Joi.boolean()
})

module.exports = schema