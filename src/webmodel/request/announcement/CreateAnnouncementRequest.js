const Joi = require('joi')

const schema = Joi.object({
    announcementTitle: Joi.string().max(255).required(),
    announcementContent: Joi.string().max(4096).required(),
    fileId: Joi.number().positive(),
    companyId: Joi.number().positive().required(), 
})

module.exports = schema