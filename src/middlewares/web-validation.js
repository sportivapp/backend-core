const Joi = require('joi');
const Schemas = require('../webmodel/request');
const ResponseHelper = require('../helper/ResponseHelper')

// enabled HTTP methods for request data validation
const supportedMethods = ['post', 'put']

// Joi validation options
const validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: false // remove unknown keys from the validated data
};

module.exports = async (req, res, next) => {

        const route = req.route.path;

        if (!supportedMethods.indexOf(req.method)) {
            next()
        }
        const schema = Schemas[route]

        if (schema) {

            try {
                // Validate req.body using the schema and validation options
                return await schema
                    .validateAsync(req.body, validationOptions)
                    .then(ignored => next())
            } catch(e) {

                let errors = {}

                e.details.forEach(detail => {
                    let error = detail.type.substring(detail.type.indexOf('.') + 1).toUpperCase()
                    errors[detail.path.join('.')] = error
                })

                return res.status(400).json(ResponseHelper.toErrorResponse(400, errors))
            }

        }
        next();
};