const firebaseAdmin = require('firebase-admin')
const loggingService = require('./slackLoggingService')

const firebaseService = {}

firebaseService.pushNotification = async (targetUserId, notificationTitle, notificationBody) => {

    const topic = `NotificationUser~${targetUserId}`

    const message = {
        notification: {
            title: notificationTitle,
            body: notificationBody
        },
        topic: topic
    }

        const messaging = firebaseAdmin.messaging()
        messaging.send(message)
            .catch(ignored => {
                const error = new Error(`Failed on sending message in topic: ${topic}`)
                return loggingService.sendSlackMessage(loggingService.setLogMessage(error))
                    .then(ignored => false)
            })
}

module.exports = firebaseService