const Announcement = require('../models/Announcement');
const AnnouncementDelete = require('../models/AnnouncementDelete');

const AnnouncementService = {};

AnnouncementService.getAllAnnouncement = async () => {
    const allAnnouncement = await Announcement.query().select();

    return allAnnouncement;
}

AnnouncementService.getAnnouncementById = async (announcementId) => {
    const announcement = await Announcement.query().select().where('eannouncementid', announcementId).first();

    return announcement;
}


AnnouncementService.createAnnouncement = async ( announcementDTO) => {
    const announcement = await Announcement.query().insert(announcementDTO);

    return announcement;
}

AnnouncementService.updateAnnouncement = async (announcementId, announcementDTO) => {
    const updatedAnnouncement = await Announcement.query().where('eannouncementid', announcementId).update(announcementDTO);

    return updatedAnnouncement;
}

//soft delete ( not actually deleted )
AnnouncementService.deleteAnnouncement = async (announcementId, userSub) => {
    const deleteAnnouncement = await AnnouncementDelete.query().where('eannouncementid', announcementId).update({
        eannouncementdeletestatus: 1,
        eannouncementdeleteby: userSub,
        eannouncementdeletetime: Date.now().toString()
    });

    return deleteAnnouncement;
}

module.exports = AnnouncementService;