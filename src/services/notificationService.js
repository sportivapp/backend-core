const Notification = require('../models/Notification')
const NotificationBody = require('../models/NotificationBody')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const NotificationEnum = require('../models/enum/NotificationEnum')

const UnsupportedOperationErrorEnum = {
    USER_NOT_EXIST: 'USER_NOT_EXIST'
}

const notificationService = {};

notificationService.checkUserInDB = async (userId) => {

    return User.query()
    .where('euserid', userId)
    .first();

}

notificationService.getAllNotification = async (page, size, user) => {

    const userInDB = await notificationService.checkUserInDB(user.sub)

    if(!userInDB)
        return ServiceHelper.toEmptyPage(page, size)

    return Notification.relatedQuery('notificationBody')
    .for(Notification.query().where('eusereuserid', user.sub))
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

notificationService.deleteNotificationBody = async () => {

    return NotificationBody.query()
    .delete()
    .where('enotificationbodycreatetime', '<', Date.now() - 2678400) // where notification already more than 30 days old
    .then(rowsAffected => rowsAffected > 0)

}

module.exports = notificationService;