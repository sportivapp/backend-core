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
    INVALID_NOTIFICATION: 'INVALID_NOTIFICATION',
    NOTIFICATION_WAS_CLICKED: 'NOTIFICATION_WAS_CLICKED',
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

notificationService.getNotificationCount = async (user) => {

    return Notification.query()
        .where('eusereuserid', user.sub)
        .andWhere('enotificationisread', false)
        .count()
        .then(notificationCount => {
            if (notificationCount.length !== 0)
                return parseInt(notificationCount[0].count);
            return 0;
        });

}

notificationService.clickNotification = async (notificationId, user) => {

    const notification = await Notification.query()
        .where('enotificationid', notificationId)
        .where('eusereuserid', user.sub)
        .where('enotificationisclicked', false)
        .first();

    if (!notification)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.INVALID_NOTIFICATION);

    if (notification && notification.enotificationisclicked === true)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.NOTIFICATION_WAS_CLICKED);

    return notification.$query()
        .updateByUserId({
            enotificationisclicked: true,
        }, user.sub)
        .returning('*');

}

notificationService.getAllNotification = async (page, size, user) => {

    const userInDB = await notificationService.checkUserInDB(user.sub)

    if(!userInDB)
        return ServiceHelper.toEmptyPage(page, size)

    return Notification.relatedQuery('notificationBody')
    .for(Notification.query().where('eusereuserid', user.sub))
    .withGraphFetched('sender(idAndName).file(baseAttributes)')
    .withGraphFetched('notification')
    // .whereIn('enotificationbodyentitytype', [NotificationEnum.forum.type, NotificationEnum.forumPost.type])
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

notificationService.saveNotificationWithTransaction = async (notificationObj, loggedInUser, targetUserIds, trx) => {

    // Logic to remove duplicate userIds and sender's userId
    let seen = {};
    seen[loggedInUser.sub] = true;
    const filteredTargetUserIds = targetUserIds.filter(targetUserId => {
        return seen.hasOwnProperty(targetUserId) ? false : (seen[targetUserId] = true);
    });

    if (filteredTargetUserIds.length === 0)
        throw new UnsupportedOperationError(UnsupportedOperationErrorEnum.MISSING_NOTIFICATION_TARGET);

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

        const notificationDTO = filteredTargetUserIds.map(targetUserId => ({
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

    // Logic to remove duplicate userIds and sender's userId
    let seen = {};
    seen[user.sub] = true;
    const filteredTargetUserIds = targetUserIds.filter(targetUserId => {
        return seen.hasOwnProperty(targetUserId) ? false : (seen[targetUserId] = true);
    });

    if (filteredTargetUserIds.length === 0)
        throw UnsupportedOperationError(UnsupportedOperationErrorEnum.MISSING_NOTIFICATION_TARGET);

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