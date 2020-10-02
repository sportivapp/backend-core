const { routes } = require('../../../constant')
const CreateAnnouncementRequest = require('./CreateAnnouncementRequest')
const UpdateAnnouncementRequest = require('./UpdateAnnouncementRequest')
const CreatePublishAnnouncementRequest = require('./CreatePublishAnnouncementRequest')

const announcementSchemas = {}

announcementSchemas[routes.announcement.create] = CreateAnnouncementRequest
announcementSchemas[routes.announcement.id] = UpdateAnnouncementRequest
announcementSchemas[routes.announcement.publish] = CreatePublishAnnouncementRequest


module.exports = announcementSchemas