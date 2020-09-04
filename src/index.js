const   express     = require('express'),
        cors        = require('cors'),
        morgan      = require('morgan'),
        fs          = require('fs'),
        https       = require('https')

const app = express();
const routes = require('./routes/v1');
const slackLoggingService = require('./helper/slackLoggingService');
const errorHandler = require('./middlewares/errorHandler');

const webHookURL = 'https://hooks.slack.com/services/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';
let errorMsg = {};

app.use(cors());
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'  
    );
    return next();
});

app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb', extended: true }));
app.use(morgan('dev'));
app.use(express.static('../temp'));

app.use(routes)

app.use((_, __, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// app.use((error, req, res, next) => {
//     // errorMsg = error;
//     console.log(error)
//     const status = error.status || 500;
//     res.status(status).send({
//         error: {
//             status: status,
//             message: error.message || 'Internal Server Error',
//         },
//     });
//
//     errorMsg = {
//         status: status,
//         message: error.message || 'Internal Server Error',
//         errStack: error.stack
//     }
//
//     slackLoggingService.sendSlackMessage(webHookURL, slackLoggingService.setLogMessage(errorMsg));
// });

app.use(errorHandler)

require('dotenv').config();
const httpPORT = process.env.PORT || 5100;
const httpServer = app.listen(httpPORT, function() {
    console.log(`HTTP Server started on port ${httpPORT}`);
})

// configuration for https
const options = {
    key: fs.readFileSync('../../../etc/ssl/private/quickplay.key', 'utf8'),
    cert: fs.readFileSync('../../../etc/ssl/certs/quickplay.crt', 'utf8')
};
const httpsServer = https.createServer(options, app);
const httpsPORT = process.env.HTTPS_PORT || 5101;
httpsServer.listen(httpsPORT, function() {
    console.log(`HTTPS Server started on port ${httpsPORT}.`);
});

module.exports = {
    httpServer: httpServer,
    httpsServer: httpsServer
}