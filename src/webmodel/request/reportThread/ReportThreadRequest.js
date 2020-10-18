const Joi = require('joi')

const schema = Joi.object({
    threadId: Joi.number().required(),
    commentId: Joi.number().allow(null),
    replyId: Joi.number().allow(null),
    message: Joi.string().max(1052)
})

module.exports = schema