const   express         = require('express'),
        cors            = require('cors'),
        morgan          = require('morgan'),
        cookieParser    = require('cookie-parser'),
        fs              = require('fs'),
        https           = require('https'),
        path            = require('path')

require('dotenv').config();
const app = express();
const routes = require('./routes/v1');
const schedulerService = require('./services/schedulerService')
const errorHandler = require('./middlewares/errorHandler');
const PathNotFoundError = require('./models/errors/PathNotFoundError')

app.use(cors());
app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'  
    );
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

app.use(cookieParser());
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({limit: '1000mb', extended: true }));
app.use(morgan('dev'));
app.use(express.static(process.env.TEMP_DIRECTORY));

app.use(routes)

app.use((_, __, ___) => {
    throw new PathNotFoundError('Path Not Found')
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

//     errorMsg = {
//         status: status,
//         message: error.message || 'Internal Server Error',
//         errStack: error.stack
//     }

//     slackLoggingService.sendSlackMessage(webHookURL, slackLoggingService.setLogMessage(errorMsg));
// });

app.use(errorHandler)

const httpPORT = process.env.PORT || 5100;
const httpServer = app.listen(httpPORT, function() {
    console.log(`HTTP Server started on port ${httpPORT}`);
})

schedulerService.initialize();

module.exports = {
    httpServer: httpServer
}