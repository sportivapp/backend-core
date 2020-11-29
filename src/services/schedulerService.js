const schedule = require('node-schedule')
const newsService = require('./newsService')

const schedulerService = {}

schedulerService.initialize = () => {
    publishScheduledNews()
}

function publishScheduledNews()  {
    schedule.scheduleJob('* * * * *', async function () {
        await newsService.publishAllScheduledNewsInDateNow()
    })
}

module.exports = schedulerService

