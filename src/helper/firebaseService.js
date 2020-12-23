const firebaseAdmin = require('firebase-admin')
const loggingService = require('./slackLoggingService')

const firebaseService = {}

firebaseService.pushNotification = async (targetUserId, notificationTitle, notificationBody) => {

    const databaseUrl = process.env.FIREBASE_URL || 'https://sportiv-development.firebaseio.com'

    const serviceAccount = require(process.env.FIREBASE_KEY_DIRECTORY);

    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: databaseUrl
    });

    const topic = `NotificationUser~${targetUserId}`

    const message = {
        notification: {
            title: notificationTitle,
            body: notificationBody
        }
    }

        const messaging = firebaseAdmin.messaging()
        messaging.sendToTopic(topic, message)
            .then(success => console.log(success))
            .catch(ignored => {
                const error = new Error(`Failed on sending message in topic: ${topic}`)
                return loggingService.sendSlackMessage(loggingService.setLogMessage(error))
                    .then(ignored => false)
            })
}

module.exports = firebaseService