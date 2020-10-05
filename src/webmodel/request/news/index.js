const { routes } = require('../../../constant')
const CreateNewsRequest = require('./CreateNewsRequest')
const UpdateNewsRequest = require('./UpdateNewsRequest')
const PublishNewsRequest = require('./PublishNewsRequest')

const newsSchemas = {}

newsSchemas[routes.news.list] = CreateNewsRequest
newsSchemas[routes.news.id] = UpdateNewsRequest
newsSchemas[routes.news.publish] = PublishNewsRequest

module.exports = newsSchemas