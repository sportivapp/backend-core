const { routes } = require('../../../constant')
const ThreadPostRequest = require('./ThreadPostRequest')

const threadPostSchemas = {}

threadPostSchemas[routes.comment.list] = ThreadPostRequest
threadPostSchemas[routes.comment.id] = ThreadPostRequest

module.exports = threadPostSchemas