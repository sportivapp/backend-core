const Notification = require('../models/Notification')
const NotificationBody = require('../models/NotificationBody')
const User = require('../models/User')
const firebaseService = require('../helper/firebaseService')
const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    USER_NOT_EXIST: 'USER_NOT_EXIST'
}

const notificationService = {};

notificationService.buildNotificationEntity = async (entityId, entityType, title, message, action) => {

    return {
        enotificationbodyentityid: entityId,
        enotificationbodyentitytype: entityType,
        enotificationbodyaction: action,
        enotificationbodytitle: title,
        enotificationbodymessage: message
    }
}

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

notificationService.saveNotification = async (notificationObj, loggedInUser, targetUserIds, db = Notification.knex()) => {

    const notificationBodyDTO = {
        enotificationbodyentityid: notificationObj.enotificationbodyentityid,
        enotificationbodyentitytype: notificationObj.enotificationbodyentitytype,
        enotificationbodyaction: notificationObj.enotificationbodyaction,
        enotificationbodytitle: notificationObj.enotificationbodytitle,
        enotificationbodymessage: notificationObj.enotificationbodymessage,
        enotificationbodysenderid: loggedInUser.sub
    }
    
    return NotificationBody.query(db)
    .insertToTable(notificationBodyDTO, loggedInUser.sub)
    .then(notificationBody => {

        const notificationDTO = targetUserIds.map(targetUserId => ({
            eusereuserid: targetUserId,
            enotificationbodyenotificationbodyid: notificationBody.enotificationbodyid
        }))

        return Notification.query(db)
        .insertToTable(notificationDTO, loggedInUser.sub)
        .then(resultArr => resultArr.map(notification => firebaseService
            .pushNotification(notification.eusereuserid, notificationBody.enotificationbodytitle, notificationBody.enotificationbodymessage)))
        .then(pushNotificationPromises => Promise.all(pushNotificationPromises))
    })

}

notificationService.saveNotificationWithTransaction = async (notificationObj, loggedInUser, targetUserIds, trx) => {

    const notificationBodyDTO = {
        enotificationbodyentityid: notificationObj.enotificationbodyentityid,
        enotificationbodyentitytype: notificationObj.enotificationbodyentitytype,
        enotificationbodyaction: notificationObj.enotificationbodyaction,
        enotificationbodytitle: notificationObj.enotificationbodytitle,
        enotificationbodymessage: notificationObj.enotificationbodymessage,
        enotificationbodysenderid: loggedInUser.sub
    }
    
    return NotificationBody.query(trx)
    .insertToTable(notificationBodyDTO, loggedInUser.sub)
    .then(notificationBody => {

        const notificationDTO = targetUserIds.map(targetUserId => ({
            eusereuserid: targetUserId.euserid,
            enotificationbodyenotificationbodyid: notificationBody.enotificationbodyid
        }))

        return Notification.query(trx)
        .insertToTable(notificationDTO, loggedInUser.sub)
        .then(resultArr => resultArr.map(notification => firebaseService
            .pushNotification(notification.eusereuserid, notificationBody.enotificationbodytitle, notificationBody)))
        .then(pushNotificationPromises => Promise.all(pushNotificationPromises))
    })

}

module.exports = notificationService;