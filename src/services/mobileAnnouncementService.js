const Announcement = require('../models/Announcement');

const announcementService = {}
const { NotFoundError } = require('../models/errors')

announcementService.getAnnouncements = async (user) => {

    const announcements = await Announcement.query()
    .withGraphJoined('users')
    .withGraphJoined('creator')
    .where('users.euserid', user.sub);

    if (announcements.length === 0)
        return [];

    const returnedAnnouncements = announcements.map(announcement => {
        return {
            eusername: announcement.creator ? announcement.creator.eusername : 'SYSTEM',
            eannouncementid: announcement.eannouncementid,
            eannouncementtitle: announcement.eannouncementtitle,
            eannouncementcontent: announcement.eannouncementcontent,
            eannouncementcreatetime: announcement.eannouncementcreatetime
        }
    });

    return returnedAnnouncements;

}

announcementService.getAnnouncement = async (announcementId, user) => {

    const announcement = await Announcement.query()
    .select('eannouncementcreatetime', 'eannouncementtitle', 'creator.eusername', 'eannouncement.efileefileid', 'eannouncementcontent')
    .joinRelated('users')
    .leftJoinRelated('creator')
    .where('eannouncementid', announcementId)
    .andWhere('eusereuserid', user.sub)
    .first();

    if (announcement.eusername === null) {
        announcement.eusername = 'SYSTEM';
    }
    
    if(!announcement) {
        throw new NotFoundError()
    }


    return announcement

}

module.exports = announcementService;