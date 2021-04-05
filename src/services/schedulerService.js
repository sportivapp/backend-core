const schedule = require('node-schedule');
const newsService = require('./newsService');
const classCategorySessionService = require('./v2/classCategorySessionService');
const classCategoryParticipantSessionService = require('./v2/classCategoryParticipantSessionService');
const mobileClassComplaintService = require('./v2/mobileClassComplaintsService');

const schedulerService = {}

schedulerService.initialize = () => {
    publishScheduledNews();
    remindClassSession();
    checkNewClassSessionParticipants();
    checkNewClassSessionComplaints();
}

function publishScheduledNews()  {
    schedule.scheduleJob('* * * * *', async function () {
        await newsService.publishAllScheduledNewsInDateNow()
    })
}

function remindClassSession() {
    schedule.scheduleJob('* * * * *', async function() {
        const sessions = await classCategorySessionService.getAllUpcomingSessions();
        await classCategoryParticipantSessionService.remindUpcomingSessions(sessions);
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
        const sessions = await classCategorySessionService.getAllFinishedSessions();
        await mobileClassComplaintService.checkNewComplaints(sessions);
    })
}

module.exports = schedulerService

