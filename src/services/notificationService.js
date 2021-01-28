const Notification = require('../models/Notification')
const NotificationBody = require('../models/NotificationBody')
const NotificationEnum = require('../models/enum/NotificationEnum')
const User = require('../models/User')
const firebaseService = require('../helper/firebaseService')
const ServiceHelper = require('../helper/ServiceHelper');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')

const UnsupportedOperationErrorEnum = {
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    MISSING_NOTIFICATION_TARGET: 'MISSING_NOTIFICATION_TARGET',
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
    .withGraphFetched('sender(idAndName).file(baseAttributes)')
    .whereIn('enotificationbodyentitytype', [NotificationEnum.forum.type, NotificationEnum.forumPost.type])
    .orderBy('enotificationbodycreatetime', 'DESC')
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
        enotificationbodyentityid: notificationObj.enotificationbodyentityid.toString(),
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

    if (targetUserIds.length === 0)
        return

    const notificationBodyDTO = {
        enotificationbodyentityid: notificationObj.enotificationbodyentityid.toString(),
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
            .pushNotification(notification.eusereuserid, notificationBody.enotificationbodytitle, notificationBody.enotificationbodymessage, notificationBody)))
        .then(pushNotificationPromises => Promise.all(pushNotificationPromises))
    })

}

notificationService.createNotification = async (notificationDTO, user, targetUserIds) => {

    if (targetUserIds.length === 0)
        throw UnsupportedOperationError(UnsupportedOperationErrorEnum.MISSING_NOTIFICATION_TARGET);

    // Logic to remove duplicate userIds and sender's userId
    let seen = {};
    seen[user.sub] = true;
    const filteredTargetUserIds = targetUserIds.filter(targetUserId => {
        return seen.hasOwnProperty(targetUserId) ? false : (seen[targetUserId] = true);
    });

    notificationDTO.enotificationbodysenderid = user.sub;
    
    return NotificationBody.query()
    .insertToTable(notificationDTO, user.sub)
    .then(notificationBody => {
        const notificationDTO = filteredTargetUserIds.map(targetUserId => ({
            eusereuserid: targetUserId,
            enotificationbodyenotificationbodyid: notificationBody.enotificationbodyid
        }))

        return Notification.query()
        .insertToTable(notificationDTO, user.sub)
        .then(resultArr => resultArr.map(notification => firebaseService
            .pushNotification(notification.eusereuserid, notificationBody.enotificationbodytitle, notificationBody)))
        .then(pushNotificationPromises => Promise.all(pushNotificationPromises))
    })

}

module.exports = notificationService;