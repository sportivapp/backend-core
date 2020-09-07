const { routes } = require('../../../constant')
const CreateAnnouncementRequest = require('./CreateAnnouncementRequest')
const UpdateAnnouncementRequest = require('./UpdateAnnouncementRequest')

const announcementSchemas = {}

announcementSchemas[routes.announcement.create] = CreateAnnouncementRequest
announcementSchemas[routes.announcement.id] = UpdateAnnouncementRequest

module.exports = announcementSchemas