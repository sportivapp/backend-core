const threadPostNotificationBodyService = {};
const notificationEnum = require('../models/enum/NotificationEnum');
const NotificationBody = require('../models/NotificationBody');

threadPostNotificationBodyService.deleteThreadPostsNotification = async (threadPostIds, trx) => {

    return NotificationBody.query(trx)
        .where('enotificationbodyentitytype', notificationEnum.forumPost.type)
        .whereIn('enotificationbodyentityid', threadPostIds)
        .delete();

}

module.exports = threadPostNotificationBodyService;