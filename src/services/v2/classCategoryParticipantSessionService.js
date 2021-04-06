const ClassCategoryParticipantSession = require('../../models/v2/ClassCategoryParticipantSession');
const notificationService = require('../notificationService');
const NotificationEnum = require('../../models/enum/NotificationEnum');
const CodeToTextMonthEnum = require('../../models/enum/CodeToTextMonthEnum');

const classCategoryParticipantSessionService = {};

const DAY_IN_MILLIS = 86400000;
const HOUR_IN_MILLIS = 3600000;
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

classCategoryParticipantSessionService.checkNewParticipants = async (sessions) => {
    const newParticipants = sessions.map(async session => {
        const participants = await ClassCategoryParticipantSession.query()
            .where('class_category_session_uuid', session.uuid)
            .then(participants => participants.filter(participant => Date.now() - participant.createTime <= MINUTE_IN_MILLIS));
        if (participants.length <= 0) return null;
        const cls = await session.$relatedQuery('class');
        const category = await session.$relatedQuery('classCategory');
        const coaches = await category.$relatedQuery('coaches');
        const sessionDate = new Date(parseInt(session.startDate));
        const user = await participants[0].$relatedQuery('user');
        const action = participants.length > 1 ? NotificationEnum.classSession.actions.newParticipants : NotificationEnum.classSession.actions.newParticipant;
        const additionalInfo = {
            param1: participants.length > 1 ? participants.length : user ? user.eusername : '',
            param2: `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`
        }
        const notificationObj = await notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession.type,
            action.title(cls.title, category.title),
            action.message(additionalInfo.param1, additionalInfo.param2),
            action.code);
        return notificationService.saveNotification(notificationObj, { sub: user.euserid }, coaches.map(coach => coach.userId));

    }).filter(promise => !!promise);

    return Promise.all(newParticipants);

}

classCategoryParticipantSessionService.checkNewConfirmations = async (sessions) => {
    const newConfirmations = sessions.map(async session => {
        const confirmations = await ClassCategoryParticipantSession.query()
            .modify('participants')
            .where('class_category_session_uuid', session.uuid)
            .where('is_confirmed', true)
            .then(confirmations => confirmations.filter(confirmation => Date.now() - confirmation.changeTime <= MINUTE_IN_MILLIS));
        if (confirmations.length <= 0) return null;
        const category = await session.$relatedQuery('classCategory');
        const cls = await session.$relatedQuery('class');
        const coaches = await category.$relatedQuery('coaches');
        const sessionDate = new Date(parseInt(session.startDate));
        const user = await confirmations[0].$relatedQuery('user');
        const action = confirmations.length > 1 ? NotificationEnum.classSession.actions.sessionsConfirmed : NotificationEnum.classSession.actions.sessionConfirmed;
        const additionalInfo = {
            param1: confirmations.length > 1 ? confirmations.length : user ? user.eusername : '',
            param2: `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`
        }
        const notificationObj = await notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession.type,
            action.title(cls.title, category.title),
            action.message(additionalInfo.param1, additionalInfo.param2),
            action.code
        );

        return notificationService.saveNotification(notificationObj, { sub: user.euserid }, coaches.map(coach => coach.userId));
    }).filter(promise => !!promise);

    return Promise.all(newConfirmations);
}

classCategoryParticipantSessionService.remindUpcomingSessionsByMinute = async (sessions, targetMinute) => {

    const reminders = sessions.filter(session => {
        const now = new Date();
        const startTime = new Date(parseInt(session.startDate));
        const diff = startTime.getTime() - now.getTime();
        return diff <= HOUR_IN_MILLIS;
    }).map(async session => {
        const participantIds = await classCategoryParticipantSessionService.getSessionParticipants(session.uuid)
            .then(participants => participants.map(participant => participant.userId));
        if (participantIds.length <= 0) return null;
        const cls = await session.$relatedQuery('class');
        const category = await session.$relatedQuery('classCategory');
        const coachIds = await category.$relatedQuery('coaches').then(coaches => coaches.map(coach => coach.userId));
        const now = new Date();
        const sessionDate = new Date(parseInt(session.startDate));
        const minuteDiff = sessionDate.getMinutes() - now.getMinutes();
        if (minuteDiff !== targetMinute) return null;
        const timeDescription = `${targetMinute} ${TimeMap.MINUTE}`
        const action = NotificationEnum.classSession.actions.reminder;
        const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;
        const notificationObj = await notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession.type,
            action.title(cls.title),
            action.message(sessionTitle, timeDescription),
            action.code);
        return notificationService.saveNotification(notificationObj, { sub: coachIds.length > 0 ? coachIds[0] : participantIds[0] }, participantIds.concat(coachIds));

    }).filter(promise => !!promise);

    return Promise.all(reminders);

}

classCategoryParticipantSessionService.remindUpcomingSessionsByHour = async (sessions, targetHour) => {

    const reminders = sessions.filter(session => {
        const now = new Date();
        const startTime = new Date(parseInt(session.startDate));
        const diff = startTime.getTime() - now.getTime();
        return diff <= DAY_IN_MILLIS;
    }).map(async session => {
        const participantIds = await classCategoryParticipantSessionService.getSessionParticipants(session.uuid)
            .then(participants => participants.map(participant => participant.userId));
        if (participantIds.length <= 0) return null;
        const cls = await session.$relatedQuery('class');
        const category = await session.$relatedQuery('classCategory');
        const coachIds = await category.$relatedQuery('coaches').then(coaches => coaches.map(coach => coach.userId));
        const now = new Date();
        const sessionDate = new Date(parseInt(session.startDate));
        const diff = sessionDate.getHours() - now.getHours();
        if (diff !== targetHour) return null;
        const timeDescription = `${targetHour} ${TimeMap.HOUR}`
        const action = NotificationEnum.classSession.actions.reminder;
        const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;
        const notificationObj = await notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession.type,
            action.title(cls.title),
            action.message(sessionTitle, timeDescription),
            action.code);
        return notificationService.saveNotification(notificationObj, { sub: coachIds.length > 0 ? coachIds[0] : participantIds[0] }, participantIds.concat(coachIds));

    }).filter(promise => !!promise);

    return Promise.all(reminders);

}

classCategoryParticipantSessionService.remindUpcomingSessionsByDay = async (sessions, targetDay) => {

    const reminders = sessions.filter(session => {
        const now = new Date();
        const startTime = new Date(parseInt(session.startDate));
        const diff = startTime.getTime() - now.getTime();
        return diff <= DAY_IN_MILLIS * (targetDay + 1);
    }).map(async session => {
        const participantIds = await classCategoryParticipantSessionService.getSessionParticipants(session.uuid)
            .then(participants => participants.map(participant => participant.userId));
        if (participantIds.length <= 0) return null;
        const cls = await session.$relatedQuery('class');
        const category = await session.$relatedQuery('classCategory');
        const coachIds = await category.$relatedQuery('coaches').then(coaches => coaches.map(coach => coach.userId));
        const now = new Date();
        const sessionDate = new Date(parseInt(session.startDate));
        const diff = sessionDate.getDate() - now.getDate();
        if (diff !== targetDay) return null;
        const timeDescription = `${targetDay} ${TimeMap.DAY}`
        const action = NotificationEnum.classSession.actions.reminder;
        const sessionTitle = `Sesi ${sessionDate.getDate()} ${CodeToTextMonthEnum[sessionDate.getMonth()]} ${sessionDate.getFullYear()}`;
        const notificationObj = await notificationService.buildNotificationEntity(
            session.uuid,
            NotificationEnum.classSession.type,
            action.title(cls.title),
            action.message(sessionTitle, timeDescription),
            action.code);
        return notificationService.saveNotification(notificationObj, { sub: coachIds.length > 0 ? coachIds[0] : participantIds[0] }, participantIds.concat(coachIds));

    }).filter(promise => !!promise);

    return Promise.all(reminders);

}

module.exports = classCategoryParticipantSessionService;