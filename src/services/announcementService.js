const Announcement = require('../models/Announcement');
const AnnouncementUserMapping = require('../models/AnnouncementUserMapping');
const AnnouncementDelete = require('../models/AnnouncementDelete');
const ServiceHelper = require('../helper/ServiceHelper')

const AnnouncementService = {};

AnnouncementService.getAllAnnouncement = async (page, size, user) => {
    const announcementPage = await Announcement.query().select().where('eannouncementdeletestatus', false).page( page, size);

    if (announcementPage && user.permission !== 1) return

    return ServiceHelper.toPageObj(page, size, announcementPage);
}

AnnouncementService.getAnnouncementById = async (announcementId, user) => {
    const announcement = await Announcement.query().select().where('eannouncementid', announcementId).first();

    if (announcement && user.permission !== 1) return

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

AnnouncementService.createAnnouncement = async ( announcementDTO, userIds, user ) => {
    if (user.permission === 1) return

    const announcement = await Announcement.query().insert(announcementDTO);

    await AnnouncementService.addUser(announcement.eannouncementid, userIds);

    return announcement;
}


AnnouncementService.updateAnnouncement = async (announcementId, announcementDTO, userIds, user) => {
    
    if (user.permission === 1) return

    // remove user that has the announcement
    await AnnouncementUserMapping.query().delete().where('eannouncementeannouncementid', announcementId);

    const result = await Announcement.query()
        .updateByUserId(announcementDTO, user.sub)
        .where('eannouncementid', announcementId)
        .returning('*');

    // Insert user that get the announcement
    await AnnouncementService.addUser(parseInt(announcementId, 10) , userIds);

    return result;
}

//soft delete ( not actually deleted )
AnnouncementService.deleteAnnouncement = async (announcementId, user) => {

    if (user.permission === 1) return

    const result = await AnnouncementDelete.query()
        .deleteByUserId(user.sub)
        .where('eannouncementid', announcementId)
        .returning('*');

    return result;
}

module.exports = AnnouncementService;