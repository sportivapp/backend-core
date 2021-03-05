const threadPostReplyNotificationBodyService = {};
const notificationEnum = require('../models/enum/NotificationEnum');
const NotificationBody = require('../models/NotificationBody');

threadPostReplyNotificationBodyService.deleteThreadPostRepliesNotification = async (threadPostReplyIds, trx) => {

    return NotificationBody.query(trx)
        .where('enotificationbodyentitytype', notificationEnum.forumPostReply.type)
        .whereIn('enotificationbodyentityid', threadPostReplyIds)
        .delete();

}

module.exports = threadPostReplyNotificationBodyService;