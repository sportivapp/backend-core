const Joi = require('joi')

const schema = Joi.object({
    name: Joi.string().max(255).required(),
    description: Joi.string().max(1025).allow('', null),
    startDate: Joi.number().positive().required(),
    endDate: Joi.number().positive().allow(0),
    price: Joi.number().positive().allow(0),
    type: Joi.string().max(255),
    address: Joi.string().max(255).required().allow('', null),
    picName: Joi.string().max(255).required().allow('', null),
    picMobileNumber: Joi.string().max(255).required(),
    industryId: Joi.number().positive().required(),
    companyId: Joi.number().positive().required(), 
    fileId: Joi.number().positive(),  
    requirements: Joi.array() 
})

module.exports = schema