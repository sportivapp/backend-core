const Announcement = require('../models/Announcement');
const AnnouncementUserMapping = require('../models/AnnouncementUserMapping');
const AnnouncementDelete = require('../models/AnnouncementDelete');

const AnnouncementService = {};

AnnouncementService.getAllAnnouncement = async () => {
    const allAnnouncement = await Announcement.query().select().where('eannouncementdeletestatus', 0);

    return allAnnouncement;
}

AnnouncementService.getAnnouncementById = async (announcementId) => {
    const announcement = await Announcement.query().select().where('eannouncementid', announcementId).first();

    return announcement;
}

AnnouncementService.addUser = async (announcementId, userIds) => {

    const users = userIds.map(user => ({
        eannouncementeannouncementid: announcementId, 
        eusereuserid: user
    }));

    const insertedUser = await AnnouncementUserMapping.query().insert(users)

    return insertedUser;
}

AnnouncementService.createAnnouncement = async ( announcementDTO, userIds ) => {
    const announcement = await Announcement.query().insert(announcementDTO);

    await AnnouncementService.addUser(announcement.eannouncementid, userIds);

    return announcement;
}


AnnouncementService.updateAnnouncement = async (announcementId, announcementDTO, userIds) => {
    // remove user that has the announcement
    await AnnouncementUserMapping.query().delete().where('eannouncementeannouncementid', announcementId);

    const updatedAnnouncement = await Announcement.query().where('eannouncementid', announcementId).update(announcementDTO);

    // Insert user that get the announcement
    await AnnouncementService.addUser(parseInt(announcementId, 10) , userIds);

    return updatedAnnouncement;
}

//soft delete ( not actually deleted )
AnnouncementService.deleteAnnouncement = async (announcementId, userSub) => {

    const deleteAnnouncement = await AnnouncementDelete.query().where('eannouncementid', announcementId).update({
        eannouncementdeletestatus: 1,
        eannouncementdeleteby: userSub,
        eannouncementdeletetime: new Date( Date.now() )
    });

    return deleteAnnouncement;
}

module.exports = AnnouncementService;