const { routes } = require('../../../constant')
const ThreadPostReplyRequest = require('./ThreadPostReplyRequest')

const threadPostReplySchemas = {}

threadPostReplySchemas[routes.commentReply.list] = ThreadPostReplyRequest
threadPostReplySchemas[routes.commentReply.id] = ThreadPostReplyRequest

module.exports = threadPostReplySchemas