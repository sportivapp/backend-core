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
    ANNOUNCEMENT_NOT_FOUND: 'ANNOUNCEMENT_NOT_FOUND',
    USER_NOT_IN_COMPANY: 'USER_NOT_IN_COMPANY'
}

AnnouncementService.getAllAnnouncement = async (page, size, user) => {

    return Announcement.query()
        .where('ecompanyecompanyid', user.companyId)
        .withGraphFetched('users(baseAttributes)')
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj));
}

AnnouncementService.getAnnouncementById = async (announcementId, user) => {

    return Announcement.query()
        .where('eannouncementid', announcementId)
        .andWhere('ecompanyecompanyid', user.companyId)
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
            return announcementLog
        })
}

AnnouncementService.publishAnnouncement = async (announcementId, userIds, user) => {

    const announcement = await AnnouncementService.getAnnouncementById(announcementId, user)
        .catch(() => new UnsupportedOperationError(ErrorEnum.ANNOUNCEMENT_NOT_FOUND))

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

    const announcement = await AnnouncementService.getAnnouncementById(announcementId, user)
        .catch(() => new UnsupportedOperationError(ErrorEnum.ANNOUNCEMENT_NOT_FOUND))

    return Announcement.transaction(async trx => {

        await AnnouncementUserMapping.query(trx).delete().where('eannouncementeannouncementid', announcementId);

        await AnnouncementService.addUser(parseInt(announcementId, 10), userIds, user, trx)

        return announcement.$query(trx).updateByUserId(announcementDTO, user.sub)
            .returning('*')

    })
}

AnnouncementService.deleteAnnouncement = async (announcementId, user) => {

    return AnnouncementService.getAnnouncementById(announcementId, user)
        .then(announcement => announcement.$query().delete().then(rowsAffected => rowsAffected === 1))
        .catch(() => false)
}

module.exports = AnnouncementService;