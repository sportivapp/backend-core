const ResponseHelper = require('../helper/ResponseHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const slackLoggingService = require('../helper/slackLoggingService');

module.exports = async (error, req, res, next) => {
    slackLoggingService.sendSlackMessage(slackLoggingService.setLogMessage(error))
        .then(ignored => processError(error, res));
}

async function processError (error, res) {
    if (error instanceof UnsupportedOperationError)
        return res.status(400).json(ResponseHelper.toErrorResponse(400, error.message))
    else if (error instanceof NotFoundError)
        return res.status(404).json(ResponseHelper.toErrorResponse(404))
    else {
        const code = error.status || 500
        const message = error.message || 'INTERNAL_SERVER_ERROR'
        return res.status(code).json(ResponseHelper.toErrorResponse(code, message))
    }
}