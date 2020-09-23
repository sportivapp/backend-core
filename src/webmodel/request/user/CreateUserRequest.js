const Joi = require('joi')

const schema = Joi.object({
    userNik: Joi.string(), 
    username: Joi.string().max(255).required(), 
    userEmail: Joi.string().max(255).required(), 
    userMobileNumber: Joi.string().max(255).required(),
    isMultiApproval: Joi.boolean()
})

module.exports = schema