const Announcement = require('../models/Announcement');
const AnnouncementUserMapping = require('../models/AnnouncementUserMapping');
const ServiceHelper = require('../helper/ServiceHelper')
const fileService = require('./fileService');
const { NotFoundError, UnsupportedOperationError } = require('../models/errors');
const companyService = require('./companyService');
const NotificationEnum = require('../models/enum/NotificationEnum');
const notificationService = require('./notificationService');
const Grade = require('../models/Grades')




const AnnouncementService = {};

const ErrorEnum = {
    COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    ANNOUNCEMENT_NOT_FOUND : "ANNOUNCEMENT_NOT_FOUND"

}

AnnouncementService.getHighestPosition = async (announcementId) => {

    const foundCompany = await Announcement.query()
    .select('ecompanyecompanyid')
    .findById(announcementId)

    if(!foundCompany) throw new NotFoundError()

    const users = await Grade.relatedQuery('users')
    .for(Grade.query()
    .where('ecompanyecompanyid',foundCompany.ecompanyecompanyid).andWhere('egradesuperiorid', null))
    .distinct('euserid')

    return users.map(user => user.euserid)
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

    const getHighestPosition = await AnnouncementService.getHighestPosition(announcementId)

    const users = userIds.map(user => ({
        eannouncementeannouncementid: announcementId, 
        eusereuserid: user
    }));

    return AnnouncementUserMapping.query().insertToTable(users, loggedInUser.sub)
    .then(announcementLog => {

        if(getHighestPosition.length > 0) {
            const notificiationObj = {
                enotificationbodyentityid : announcementId,
                enotificationbodyentitytype: NotificationEnum.announcement.type,
                enotificationbodyaction: NotificationEnum.announcement.actions.publish.code,
                enotificationbodytitle: NotificationEnum.announcement.actions.publish.title,
                enotificationbodymessage: NotificationEnum.announcement.actions.publish.message            }
        

        notificationService.saveNotification(
            notificiationObj,
            loggedInUser,
            getHighestPosition
        )
    }

        return announcementLog
    })
}

AnnouncementService.publishAnnouncement = async (announcementId, userIds, user ) => {

    const announcement = await Announcement.query().findById(announcementId)

    if (!announcement) throw new UnsupportedOperationError(ErrorEnum.ANNOUNCEMENT_NOT_FOUND)

    return AnnouncementService.addUser(announcement.eannouncementid, userIds, user);
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