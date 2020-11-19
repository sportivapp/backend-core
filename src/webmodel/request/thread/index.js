const { routes } = require('../../../constant')
const CreateThreadRequest = require('./CreateThreadRequest')
const UpdateThreadRequest = require('./UpdateThreadRequest')

const threadSchemas = {}

threadSchemas[routes.thread.list] = CreateThreadRequest
threadSchemas[routes.thread.id] = UpdateThreadRequest

const MOBILE_BASE_URL = '/mobile';

threadSchemas[MOBILE_BASE_URL + routes.thread.list] = CreateThreadRequest

module.exports = threadSchemas