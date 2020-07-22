const   swaggerJsDoc= require('swagger-jsdoc'),
        swaggerUi   = require('swagger-ui-express')

const routes = require('./routes/v1');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Emtiv Backend API',
            version: '1.0.0',
            description: 'Emtiv Backend API Description',
        },
        host: 'localhost:3000',
        basePath: '/api/v1',
        tags: [
            {
            "name": "Users",
            "description": "API for users in the system"
            }

        ],
        schemes: [
            "http",
            "https"
        ],
        consumes: [
            "application/json"
        ],
        produces: [
            "application/json"
        ],
        securityDefinitions: {
            "ApiKeyAuth":{
                "type": "apiKey",
                "in": "headers",
                "name": "authorization"
            }
        },
    },
    // path to the API docs
    apis: ['./src/routes/v1/*.js'],
  };

// setup swagger
const swaggerDocs = swaggerJsDoc(options);

module.exports = (app) => {
    // make swagger docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use('/api/v1', routes);
    // serve swagger
    app.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerDocs);
    });
}

