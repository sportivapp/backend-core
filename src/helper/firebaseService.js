const firebaseAdmin = require('firebase-admin')
const loggingService = require('./slackLoggingService')

const firebaseService = {}

firebaseService.pushNotification = async (targetUserId, notificationTitle, notificationBody) => {

    const topic = `NotificationUser~${targetUserId}`
    
	notificationBody.enotificationbodyentityid = notificationBody.enotificationbodyentityid.toString();
	notificationBody.enotificationbodysenderid = notificationBody.enotificationbodysenderid.toString();
	notificationBody.enotificationbodycreatetime = notificationBody.enotificationbodycreatetime.toString();
	notificationBody.enotificationbodycreateby = notificationBody.enotificationbodycreateby.toString();
	notificationBody.enotificationbodychangetime = notificationBody.enotificationbodychangetime.toString();
	notificationBody.enotificationbodychangeby = notificationBody.enotificationbodychangeby.toString();
	notificationBody.enotificationbodyid = notificationBody.enotificationbodyid.toString();

    const message = {
        // notification: {
        //     title: notificationTitle,
        //     body: notificationBody.enotificationbodymessage
        // },
    	data: notificationBody
    }

        const messaging = firebaseAdmin.messaging()
        messaging.sendToTopic(topic, message)
            .then(success => loggingService.sendNotificationMessage(topic, message, success))
            .catch(ignored => {
                const error = new Error(`Failed on sending message in topic: ${topic}, details: ${ignored}`)
                return loggingService.sendSlackMessage(loggingService.setLogMessage(error))
                    .then(ignored => false)
            })
}

module.exports = firebaseService