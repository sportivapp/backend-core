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

const NotificationType = {
    FORUM: 'FORUM',
    CLASS: 'CLASS',
    NEWS: 'NEWS',
    TOURNAMENT: 'TOURNAMENT',
    ALL: 'ALL'
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

notificationService.getNotificationCount = async (type = NotificationType.ALL, user) => {

    let subQuery = NotificationBody.query();

    if (type !== NotificationType.ALL && type !== '' && NotificationType[type]) {

        const enumTypes = [];

        if (type === NotificationType.FORUM) {
            enumTypes.push(NotificationEnum.forum.type);
            enumTypes.push(NotificationEnum.forumPostReply.type);
            enumTypes.push(NotificationEnum.forumPost.type);
        } else if (type === NotificationType.NEWS) {
            enumTypes.push(NotificationEnum.news.type);
        } else if (type === NotificationType.CLASS) {
            enumTypes.push(NotificationEnum.classCategory.type);
            enumTypes.push(NotificationEnum.classSession.type);
        }

        subQuery = subQuery.whereIn('enotificationbodyentitytype', enumTypes);
    }

    return NotificationBody.relatedQuery('notifications')
        .for(subQuery)
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
        throw new NotFoundError();

    if (notification && notification.enotificationisclicked === true)
        return true;

    return notification.$query()
        .updateByUserId({
            enotificationisclicked: true,
        }, user.sub)
        .then(rowsAffected => rowsAffected === 1);

}

notificationService.readNotifications = async (enumTypes, userId) => {

    return NotificationBody.relatedQuery('notifications')
        .for(NotificationBody.query().whereIn('enotificationbodyentitytype', enumTypes))
        .where('eusereuserid', userId)
        .patch({
            enotificationisread: true,
            enotificationchangeby: userId,
            enotificationchangetime: Date.now()
        });

}

notificationService.getAllNotification = async (page, size, type, user) => {

    if (!NotificationType[type]) return ServiceHelper.toEmptyPage(page, size);

    const userInDB = await notificationService.checkUserInDB(user.sub)

    if(!userInDB)
        return ServiceHelper.toEmptyPage(page, size);

    const enumTypes = [];

    if (type === NotificationType.FORUM) {
        enumTypes.push(NotificationEnum.forum.type);
        enumTypes.push(NotificationEnum.forumPostReply.type);
        enumTypes.push(NotificationEnum.forumPost.type);
    } else if (type === NotificationType.NEWS) {
        enumTypes.push(NotificationEnum.news.type);
    } else if (type === NotificationType.CLASS) {
        enumTypes.push(NotificationEnum.classCategory.type);
        enumTypes.push(NotificationEnum.classSession.type);
    }

    await notificationService.readNotifications(enumTypes, user.sub);

    const notificationPage = await Notification.relatedQuery('notificationBody')
    .modify('baseAttributes')
    .for(Notification.query().where('eusereuserid', user.sub))
    .whereIn('enotificationbodyentitytype', enumTypes)
    .withGraphFetched('sender(idAndName).file(baseAttributes)')
    .orderBy('enotificationbodycreatetime', 'DESC')
    .page(page, size)

    const notificationPageResultsPromise = notificationPage.results.map(async notification => {
        const status = await Notification.query()
            .modify('status')
            .where('eusereuserid', user.sub)
            .first();

        return {
            ...notification,
            status: status,
        }
    })

    return Promise.all(notificationPageResultsPromise)
        .then(nList => { 
            notificationPage.results = nList; 
            return notificationPage
        })
        .then(pageObj => ServiceHelper.toPageObj(page, size, pageObj))

}

notificationService.saveNotification = async (notificationObj, loggedInUser, targetUserIds) => {

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
    
    return NotificationBody.query()
    .insertToTable(notificationBodyDTO, loggedInUser.sub)
    .then(notificationBody => {

        const notificationDTO = filteredTargetUserIds.map(targetUserId => ({
            eusereuserid: targetUserId,
            enotificationbodyenotificationbodyid: notificationBody.enotificationbodyid
        }))

        return Notification.query()
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