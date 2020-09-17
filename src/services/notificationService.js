const Notification = require('../models/Notification')
const NotificationBody = require('../models/NotificationBody')
const User = require('../models/User')
const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

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
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    return Notification.query()
    .select()
    .where('eusereuserid', user.sub)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

notificationService.getAllNotificationBody = async (page, size, user, type) => {

    const userInDB = await notificationService.checkUserInDB(user.sub)

    if(!userInDB)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    if(type !== 'COMPANY' && type !== 'CLASS' && type !== 'ALL')
        throw new NotFoundError()

    if(type === 'ALL')
        return NotificationBody.query()
        .joinRelated('notifications')
        .where('eusereuserid', user.sub)
        .page(page, size)
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

    return NotificationBody.query()
    .joinRelated('notifications')
    .where('eusereuserid', user.sub)
    .andWhere('enotificationbodyentitytype', type)
    .page(page, size)
    .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

notificationService.deleteNotification = async (notificationId, user) => {

    const userInDB = await notificationService.checkUserInDB(user.sub)

    if(!userInDB)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.USER_NOT_EXIST)

    return Notification.query()
    .delete()
    .where('eusereuserid', user.sub)
    .andWhere('enotificationid', notificationId)
    .first()
    .then(rowsAffected => rowsAffected === 1)

}

module.exports = notificationService;