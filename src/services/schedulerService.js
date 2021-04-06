const schedule = require('node-schedule');
const newsService = require('./newsService');
const classCategorySessionService = require('./v2/classCategorySessionService');
const classCategoryParticipantSessionService = require('./v2/classCategoryParticipantSessionService');
const mobileClassComplaintService = require('./v2/mobileClassComplaintsService');

const schedulerService = {}

schedulerService.initialize = () => {
    publishScheduledNews();
    remindClassSessionBy15Minute();
    remindClassSessionBy30Minute();
    remindClassSessionByOneHour();
    remindClassSessionByTwoHour();
    remindClassSessionByOneDay();
    checkNewClassSessionParticipants();
    checkNewClassSessionComplaints();
    checkNewClassSessionConfirmations();
}

function publishScheduledNews()  {
    schedule.scheduleJob('* * * * *', async function () {
        await newsService.publishAllScheduledNewsInDateNow()
    })
}

function remindClassSessionBy15Minute() {
    schedule.scheduleJob('*/15 * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByMinute(sessions, 15);
    })
}

function remindClassSessionBy30Minute() {
    schedule.scheduleJob('*/30 * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByMinute(sessions, 30);
    })
}

function remindClassSessionByOneHour() {
    schedule.scheduleJob('0 * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByHour(sessions, 1);
    })
}

function remindClassSessionByTwoHour() {
    schedule.scheduleJob('0 */2 * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByHour(sessions, 2);
    })
}

function remindClassSessionByOneDay() {
    schedule.scheduleJob('0 0 * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByDay(sessions, 1);
    })
}

function checkNewClassSessionParticipants() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.checkNewParticipants(sessions);
    })
}

function checkNewClassSessionComplaints() {
    schedule.scheduleJob('* * * * *', async function() {
        console.log('checking complaints');
        const sessions = await classCategorySessionService.getAllFinishedSessions();
        await mobileClassComplaintService.checkNewComplaints(sessions);
    })
}

function checkNewClassSessionConfirmations() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllFinishedSessions();
        await classCategoryParticipantSessionService.checkNewConfirmations(sessions);
    })
}

module.exports = schedulerService

