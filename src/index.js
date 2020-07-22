const   express     = require('express'),
        cors        = require('cors'),
        morgan      = require('morgan')

const app = express();
const routes = require('./routes/v1');
const swaggerDoc = require('./swaggerDoc');

// use swagger
swaggerDoc(app);

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

app.use(routes)

app.use((_, __, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    const status = error.status || 500;

    res.status(status).send({
        error: {
            status: status,
            message: error.message || 'Internal Server Error',
        },
    });

});


const httpPORT = process.env.PORT || 7000;
const httpServer = app.listen(httpPORT, function() {
    console.log(`HTTP Server started on port ${httpPORT}`);
})

module.exports = {
    httpServer: httpServer
}