const ClassReasons = require('../../models/v2/ClassReasons');
const notificationService = require('../notificationService');
const NotificationEnum = require('../../models/enum/NotificationEnum');
const CodeToTextMonthEnum = require('../../models/enum/CodeToTextMonthEnum');
const { UnsupportedOperationError } = require('../../models/errors');

const ErrorEnum = {
    DOUBLE_REASON: 'DOUBLE_REASON',
}

mobileClassReasonsService = {};

mobileClassReasonsService.checkExistUserReason = async (classCategorySessionUuid, user) => {

    return ClassReasons.query()
        .where('class_category_session_uuid', classCategorySessionUuid)
        .where('create_by', user.sub)
        .first()
        .then(reason => {
            if (reason)
                throw new UnsupportedOperationError(ErrorEnum.DOUBLE_REASON);
            return reason;
        });

}

mobileClassReasonsService.reason = async (classReasonsDTO, user) => {

    const notifAction = NotificationEnum.classSession.actions.reason;

    const reason = await ClassReasons.query()
        .insertToTable(classReasonsDTO, user.sub);

    const cls = await reason.$relatedQuery('class');
    const session = await reason.$relatedQuery('classCategorySession');
    const category = await session.$relatedQuery('classCategory');
    const coaches = await category.$relatedQuery('coaches');
    const foundUser = await reason.$relatedQuery('user');

    const sessionDate = new Date(parseInt(session.startDate));

    const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;

    const notificationObj = await notificationService.buildNotificationEntity(
        session.uuid,
        NotificationEnum.classSession.type,
        notifAction.title(cls.title, category.title),
        notifAction.message(foundUser.eusername, sessionTitle),
        notifAction.code
    )

    notificationService.saveNotification(notificationObj, user, coaches.map(coach => coach.userId));

    return reason;

}

module.exports = mobileClassReasonsService;