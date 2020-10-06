const Announcement = require('../models/Announcement');
const AnnouncementUserMapping = require('../models/AnnouncementUserMapping');
const ServiceHelper = require('../helper/ServiceHelper')
const fileService = require('./fileService');
const {NotFoundError, UnsupportedOperationError} = require('../models/errors');
const companyService = require('./companyService');
const NotificationEnum = require('../models/enum/NotificationEnum');
const notificationService = require('./notificationService');
const Grade = require('../models/Grades')

const AnnouncementService = {};

const ErrorEnum = {
    COMPANY_NOT_FOUND: 'COMPANY_NOT_FOUND',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    ANNOUNCEMENT_NOT_FOUND: "ANNOUNCEMENT_NOT_FOUND"
}

AnnouncementService.getAllAnnouncement = async (page, size) => {

    return Announcement.query()
        .withGraphFetched('users(baseAttributes)')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));
}

AnnouncementService.getAnnouncementById = async (announcementId) => {

    return Announcement.query()
        .findById(announcementId)
        .withGraphFetched('users(baseAttributes)')
        .then(announcement => {
            if (!announcement) throw new NotFoundError()
            return announcement
        })
}

AnnouncementService.addUser = async (announcementId, userIds, loggedInUser, db) => {

    const users = userIds.map(user => ({
        eannouncementeannouncementid: announcementId,
        eusereuserid: user
    }));

    return AnnouncementUserMapping.query(db).insertToTable(users, loggedInUser.sub)
        .then(announcementLog => {

            if (users.length > 0) {
                const notificationObj = {
                    enotificationbodyentityid: announcementId,
                    enotificationbodyentitytype: NotificationEnum.announcement.type,
                    enotificationbodyaction: NotificationEnum.announcement.actions.publish.code,
                    enotificationbodytitle: NotificationEnum.announcement.actions.publish.title,
                    enotificationbodymessage: NotificationEnum.announcement.actions.publish.message
                }


                notificationService.saveNotification(
                    notificationObj,
                    loggedInUser,
                    userIds
                )
            }

            return announcementLog
        })
}

AnnouncementService.publishAnnouncement = async (announcementId, userIds, user) => {

    const announcement = await Announcement.query().findById(announcementId)

    if (!announcement) throw new UnsupportedOperationError(ErrorEnum.ANNOUNCEMENT_NOT_FOUND)

    return AnnouncementService.addUser(announcement.eannouncementid, userIds, user, Announcement.knex());
}

AnnouncementService.createAnnouncement = async (announcementDTO, user) => {

    const company = await companyService.getCompanyById(announcementDTO.ecompanyecompanyid)

    const file = await fileService.getFileById(announcementDTO.efileefileid)

    if (!company) throw new UnsupportedOperationError(ErrorEnum.COMPANY_NOT_FOUND)

    if (!file) throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)

    const announcement = await Announcement.query().insertToTable(announcementDTO, user.sub)

    return announcement

}


AnnouncementService.updateAnnouncement = async (announcementId, announcementDTO, userIds, user) => {

    const announcement = await Announcement.query()
        .findById(announcementId)
        .first()

    if (!announcement) throw new UnsupportedOperationError(ErrorEnum.ANNOUNCEMENT_NOT_FOUND)

    return Announcement.transaction(async trx => {

        await AnnouncementUserMapping.query(trx).delete().where('eannouncementeannouncementid', announcementId);

        await AnnouncementService.addUser(parseInt(announcementId, 10), userIds, user, trx)

        return announcement.$query(trx).updateByUserId(announcementDTO, user.sub)
            .returning('*')

    })
}

AnnouncementService.deleteAnnouncement = async (announcementId, user) => {

    const announcement = await Announcement.query()
        .findById(announcementId)
        .first()

    if (!announcement) return false

    if (announcement.ecompanyecompanyid && announcement.ecompanyecompanyid !== user.companyId) return false

    return announcement.$query().delete().then(rowsAffected => rowsAffected === 1)
}

module.exports = AnnouncementService;