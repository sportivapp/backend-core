const ResponseHelper = require('../helper/ResponseHelper')
const { UnsupportedOperationError, NotFoundError, UnauthorizedError, PathNotFoundError } = require('../models/errors')
const slackLoggingService = require('../helper/slackLoggingService');

module.exports = async (error, req, res, next) => {
    return processError(error, res)
}

async function processError (error, res) {
    if (error instanceof UnsupportedOperationError)
        return res.status(400).json(ResponseHelper.toErrorResponse(400, error.message))
    else if (error instanceof UnauthorizedError)
        return res.status(401).json(ResponseHelper.toErrorResponse(401))
    else if (error instanceof NotFoundError)
        return res.status(404).json(ResponseHelper.toErrorResponse(404))
    else if (error instanceof PathNotFoundError)
        return res.status(404).json(ResponseHelper.toErrorResponse(404, error.message))
    else {
        const code = error.status || 500
        const message = error.message || 'INTERNAL_SERVER_ERROR'
        slackLoggingService.sendSlackMessage(slackLoggingService.setLogMessage(error))
        return res.status(code).json(ResponseHelper.toErrorResponse(code, message))
    }
}