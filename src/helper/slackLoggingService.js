const https = require('https');

Messages = {};

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const notificationSlackUrl = process.env.NOTIFICATION_SLACK_URL || ''

// const userAccountNotification = {
//     'username': 'SURYA WIBU', // This will appear as user name who posts the message
//     'text': 'Ceritanya fail gitu', // text
//     'icon_emoji': ':scream:', // User icon, you can also use custom icons here
//     'attachments': [
//       { // this defines the attachment block, allows for better layout usage
//       'color': '#eed140', // color of the attachments sidebar.
//       'fields': [ // actual fields
//         {
//           'title': 'Error Message', // Custom field
//           'value': e.message, // Custom value
//           'short': true // long fields will be full width
//         },

//       ],
//       "actions": [ // Slack supports many kind of different types, we'll use buttons here
//       {
//         "type": "button",
//         "text": "Show order", // text on the button 
//         "url": "http://example.com" // url the button will take the user if clicked
//       },
//       {
//         "type": "button",
//         "text": "Handle delivery",
//         "style": "primary", // you can have buttons styled either primary or danger
//         "url": "http://example.com"
//       },
//       {
//         "type": "button",
//         "text": "Cancel order",
//         "style": "danger",
//         "url": "http://example.com/order/1/cancel"
//       }
//     ]
//     }]
//   };

Messages.setNotificationMessage = ( topic, message, success ) => {

  return userAccountNotification = {
    'username': 'NOTIFICATION BOT',
    'text': 'NEW NOTIFICATION!',
    'icon_emoji': ':japanese_goblin:', // User icon, you can also use custom icons here
        'attachments': [
            { // this defines the attachment block, allows for better layout usage
            'color': '#eed140', // color of the attachments sidebar.
            'fields': [ // actual fields
                {
                    'type': success.messageId + ' : ' + topic,
                    'value': message,
                },
            ],
        }]
    };

}

Messages.setLogMessage = ( error ) => {
    return userAccountNotification = {
        'username': 'ERROR BOT', // This will appear as user name who posts the message
        'text': 'ERROR OCCURED!', // text
        'icon_emoji': ':japanese_goblin:', // User icon, you can also use custom icons here
        'attachments': [
            { // this defines the attachment block, allows for better layout usage
            'color': '#eed140', // color of the attachments sidebar.
            'fields': [ // actual fields
                {
                    'type': error.name,
                    'value': error.message 
                    // + '\n ROUTES: ' + error.routes
                    + ' \n\n\n\n DETAILS:\n\n' 
                    + error.stack,
                    'short': true // long fields will be full width
                },
            ],
        }]
    };
}

  /**
 * Handles the actual sending request. 
 * We're turning the https.request into a promise here for convenience
 * @param messageBody
 * @return {Promise}
 */
Messages.sendSlackMessage = async (messageBody, type) => {
    // make sure the incoming message body can be parsed into valid JSON
    try {
      messageBody = JSON.stringify(messageBody);
    } catch (e) {
      throw new Error('Failed to stringify messageBody', e);
    }
  
    // Promisify the https.request
    return new Promise((resolve, reject) => {
      // general request options, we defined that it's a POST request and content is JSON
      const requestOptions = {
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        }
      };
  
      let usedSlackUrl = slackUrl;
      if( type === 'NOTIFICATION' )
        usedSlackUrl = notificationSlackUrl;
      console.log(usedSlackUrl);

      // actual request
      const req = https.request(usedSlackUrl, requestOptions, (res) => {
        let response = '';
  
  
        res.on('data', (d) => {
          response += d;
        });
  
        // response finished, resolve the promise with data
        res.on('end', () => {
          resolve(response);
        })
      });
  
      // there was an error, reject the promise
      req.on('error', (e) => {
        reject(e);
      });
  
      // send our message body (was parsed to JSON beforehand)
      req.write(messageBody);
      req.end();
    });
  }

  module.exports = Messages;