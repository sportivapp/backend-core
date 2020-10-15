const { routes } = require('../../../constant')
const CreateThreadRequest = require('./CreateThreadRequest')
const UpdateThreadRequest = require('./UpdateThreadRequest')

const threadSchemas = {}

threadSchemas[routes.thread.list] = CreateThreadRequest
threadSchemas[routes.thread.id] = UpdateThreadRequest

module.exports = threadSchemas