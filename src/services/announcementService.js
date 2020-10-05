const Announcement = require('../models/Announcement');
const AnnouncementUserMapping = require('../models/AnnouncementUserMapping');
const ServiceHelper = require('../helper/ServiceHelper')
const fileService = require('./fileService');
const { NotFoundError, UnsupportedOperationError } = require('../models/errors');
const companyService = require('./companyService');



const AnnouncementService = {};

const ErrorEnum = {
    COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',

}

AnnouncementService.getAllAnnouncement = async (page, size, type = 'IN', user) => {

    if (type === 'IN')

        return AnnouncementUserMapping.relatedQuery('announcement')
            .for(AnnouncementUserMapping.query().where('eusereuserid', user.sub))
            .withGraphFetched('users(baseAttributes)')
            .page(page, size)
            .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));

    else

        return Announcement.query()
            .where('eannouncementcreateby', user.sub)
            .withGraphFetched('users(baseAttributes)')
            .page(page, size)
            .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));
}

AnnouncementService.getAnnouncementById = async (announcementId, user) => {

    const announcement = await Announcement.query()
        .where('eannouncementid', announcementId)
        .andWhere('eannouncementcreateby', user.sub)
        .withGraphFetched('users(baseAttributes)')
        .first()

    if (!announcement)

        return AnnouncementUserMapping.relatedQuery('announcement')
            .for(AnnouncementUserMapping.query()
                .where('eannouncementeannouncementid', announcementId)
                .andWhere('eusereuserid', user.sub)
                .first())
            .withGraphFetched('users(baseAttributes)')

    return announcement
}

AnnouncementService.addUser = async (announcementId, userIds, loggedInUser) => {

    const users = userIds.map(user => ({
        eannouncementeannouncementid: announcementId, 
        eusereuserid: user
    }));

    return AnnouncementUserMapping.query().insertToTable(users, loggedInUser.sub);
}

AnnouncementService.publishAnnouncement = async (announcementDTO,announcementId, userIds, user ) => {

    const getAnnouncement = await Announcement.query()
    .where('eannouncementid', announcementId)
    .andWhere('eannouncementcreateby', user.sub)
    .first()

    if(!getAnnouncement) return

    const announcement = await Announcement.query().insertToTable(announcementDTO,announcementId, user.sub)

    await AnnouncementService.addUser(announcement.eannouncementid, userIds, user);

    return announcement;
}

AnnouncementService.createAnnouncement = async (announcementDTO,user) => {

    const company = await companyService.getCompanyById(announcementDTO.ecompanyecompanyid)

    const file = await fileService.getFileById(announcementDTO.efileefileid)

    if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)

    if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    
    const announcement = await Announcement.query().insertToTable(announcementDTO,user.sub)

    return announcement
    
}


AnnouncementService.updateAnnouncement = async (announcementId, announcementDTO, userIds, user) => {

    const announcement = await Announcement.query()
        .where('eannouncementid', announcementId)
        .andWhere('eannouncementcreateby', user.sub)
        .first()

    if (!announcement) return

    // remove user that has the announcement
    await AnnouncementUserMapping.query().delete().where('eannouncementeannouncementid', announcementId);

    const result = announcement.$query()
        .updateByUserId(announcementDTO, user.sub)
        .returning('*');

    // Insert user that get the announcement
    await AnnouncementService.addUser(parseInt(announcementId, 10) , userIds, user);

    return result;
}

AnnouncementService.deleteAnnouncement = async (announcementId, user) => {

    const announcement = await Announcement.query()
        .where('eannouncementid', announcementId)
        .andWhere('eannouncementcreateby', user.sub)
        .first()

    if (!announcement) return false

    return announcement.$query().delete().then(rowsAffected => rowsAffected === 1);
}

module.exports = AnnouncementService;