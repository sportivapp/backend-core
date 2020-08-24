const Announcement = require('../models/Announcement');

const announcementService = {}

announcementService.getAnnouncements = async (user) => {

    return Announcement.query().withGraphJoined('users').where('euserid', user.sub);

}

module.exports = announcementService;