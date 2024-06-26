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
        topic: topic,
        data: notificationBody,
        apns: {
            headers: {
                "apns-priority": "10",
            },
            payload: {
                aps: {
                    alert: {
                        title: notificationBody.enotificationbodytitle,
                        body: notificationBody.enotificationbodymessage,
                    }
                }
            }
        }
    }

    const messaging = firebaseAdmin.messaging()
    messaging.send(message)
        .then(success => {
            return loggingService.sendSlackMessage(loggingService.setNotificationMessage(topic, message, success), 'NOTIFICATION')
                .then(result => true);
        })
        .catch(err => {
            const error = new Error(`Failed on sending message in topic: ${topic}, details: ${err}`)
            return loggingService.sendSlackMessage(loggingService.setLogMessage(error))
                .then(err => false)
        });
}

module.exports = firebaseService