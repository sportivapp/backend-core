const firebaseAdmin = require('firebase-admin')
const loggingService = require('./slackLoggingService')

const firebaseService = {}

firebaseService.pushNotification = async (targetUserId, notificationTitle, notificationMessage, notificationBody) => {

    const topic = `NotificationUser~${targetUserId}`
    
	notificationBody.enotificationbodyentityid = notificationBody.enotificationbodyentityid.toString();
	notificationBody.enotificationbodysenderid = notificationBody.enotificationbodysenderid.toString();
	notificationBody.enotificationbodycreatetime = notificationBody.enotificationbodycreatetime.toString();
	notificationBody.enotificationbodycreateby = notificationBody.enotificationbodycreateby.toString();
	notificationBody.enotificationbodychangetime = notificationBody.enotificationbodychangetime.toString();
	notificationBody.enotificationbodychangeby = notificationBody.enotificationbodychangeby.toString();
	notificationBody.enotificationbodyid = notificationBody.enotificationbodyid.toString();

    const message = {
        notification: {
            title: notificationTitle,
            body: notificationMessage
        },
    	data: notificationBody
    }

        const messaging = firebaseAdmin.messaging()
        messaging.sendToTopic(topic, message)
            .then(success => console.log(success))
            .catch(err => {
                const error = new Error(`Failed on sending message in topic: ${topic}, details: ${err}`)
                console.log(error)
                return loggingService.sendSlackMessage(loggingService.setLogMessage(error))
                    .then(ignored => false)
            })
}

module.exports = firebaseService