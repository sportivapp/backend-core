const ClassCategoryParticipantSession = require('../../models/v2/ClassCategoryParticipantSession');
const notificationService = require('../notificationService');
const NotificationEnum = require('../../models/enum/NotificationEnum');

const classCategoryParticipantSessionService = {};

const DAY_IN_MILLIS = 86400000;
const MINUTE_IN_MILLIS = 60000;

const TimeMap = {
    DAY: 'Hari',
    HOUR: 'Jam',
    MINUTE: 'Menit'
}

classCategoryParticipantSessionService.getSessionParticipants = async (sessionUuid) => {

    return ClassCategoryParticipantSession.query()
        .modify('participants')
        .where('class_category_session_uuid', sessionUuid);

}

classCategoryParticipantSessionService.remindUpcomingSessions = async (sessions) => {

    const reminders = sessions.filter(session => {
        const now = new Date();
        const startTime = new Date(session.start_date);
        const diff = startTime.getTime() - now.getTime();
        return diff <= DAY_IN_MILLIS;
    }).map(async session => {
        const participantIds = classCategoryParticipantSessionService.getSessionParticipants(session.uuid)
            .then(participants => participants.map(participant => participant.user_id));
        const cls = await session.$relatedQuery('class');
        const category = await session.$relatedQuery('classCategory');
        const coachIds = await category.$relatedQuery('coaches').then(coaches => coaches.map(coach => coach.user_id));
        const now = new Date();
        const startTime = new Date(session.start_date);
        const diff = startTime.getTime() - now.getTime();
        let timeDescription;
        if (diff < (DAY_IN_MILLIS / 24)) {
            const minuteDiff = startTime.getMinutes() - now.getMinutes()
            if (minuteDiff === 15 || minuteDiff === 30) timeDescription = `${minuteDiff} ${TimeMap.MINUTE}`
        } else if (diff < DAY_IN_MILLIS) {
            const hourDiff = startTime.getHours() - now.getHours()
            if (hourDiff === 1 || hourDiff === 2) timeDescription = `${hourDiff * 60} ${TimeMap.MINUTE}`
        }
        else {
            timeDescription = `${1} ${TimeMap.HOUR}`
        }
        const action = NotificationEnum.classSession.actions.reminder;
        const notificationObj = notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession,
            action.title(cls.title),
            action.message(session.title, timeDescription),
            action.code);
        return notificationService.saveNotification(notificationObj, participantIds.concat(coachIds));

    });

    return Promise.all(reminders);

}

classCategoryParticipantSessionService.checkNewParticipants = async (sessions) => {
    const newParticipants = sessions.map(async session => {
        const participants = classCategoryParticipantSessionService.getSessionParticipants(session.uuid)
            .then(participants => participants.filter(participant => Date.now() - participant.create_time <= MINUTE_IN_MILLIS))
        const cls = await session.$relatedQuery('class');
        const category = await session.$relatedQuery('classCategory');
        const sessionDate = new Date(session.start_date);
        const userName = await participants.length === 1 ? participants[0].$relatedQuery('user') : null;
        const action = participants.length > 1 ? NotificationEnum.classSession.actions.newParticipants : NotificationEnum.classSession.actions.newParticipant;
        const additionalInfo = {
            param1: participants.length > 1 ? participants.length : userName,
            param2: `Sesi ${sessionDate.getDate()} ${sessionDate.getMonth()} ${sessionDate.getFullYear()}`
        }
        const notificationObj = notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession,
            action.title(cls.title, category.title),
            action.message(...additionalInfo),
            action.code);
        return notificationService.saveNotification(notificationObj, participants.map(participant => participant.user_id));

    });

    return Promise.all(newParticipants);

}

module.exports = classCategoryParticipantSessionService;