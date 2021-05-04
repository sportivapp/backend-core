const schedule = require('node-schedule');
const newsService = require('./newsService');
const classCategorySessionService = require('./v2/classCategorySessionService');
const classCategoryParticipantSessionService = require('./v2/classCategoryParticipantSessionService');
const mobileClassComplaintService = require('./v2/mobileClassComplaintsService');
const mobileClassRatingsService = require('./v2/mobileClassRatingsService');

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
    checkNewClassSessionRatings();
    checkLastClassSession();
}

function publishScheduledNews()  {
    schedule.scheduleJob('* * * * *', async function () {
        await newsService.publishAllScheduledNewsInDateNow()
    });
}

function remindClassSessionBy15Minute() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByMinute(sessions, 15);
    });
}

function remindClassSessionBy30Minute() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByMinute(sessions, 30);
    });
}

function remindClassSessionByOneHour() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByHour(sessions, 1);
    });
}

function remindClassSessionByTwoHour() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByHour(sessions, 2);
    });
}

function remindClassSessionByOneDay() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessionsByDay(sessions, 1);
    });
}

function checkNewClassSessionParticipants() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.checkNewParticipants(sessions);
    });
}

function checkNewClassSessionComplaints() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllFinishedSessions();
        await mobileClassComplaintService.checkNewComplaints(sessions);
    });
}

function checkNewClassSessionConfirmations() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllFinishedSessions();
        await classCategoryParticipantSessionService.checkNewConfirmations(sessions);
    });
}

function checkNewClassSessionRatings() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllFinishedSessions();
        await mobileClassRatingsService.checkNewRatings(sessions);
    });
}

function checkLastClassSession() {
    schedule.scheduleJob('0 0 * * *', async function() {
        await classCategorySessionService.checkLastSession();
    });
}

module.exports = schedulerService

