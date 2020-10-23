const ResponseHelper = require('../helper/ResponseHelper')
const { UnsupportedOperationError, NotFoundError, UnauthorizedError } = require('../models/errors')
const slackLoggingService = require('../helper/slackLoggingService');

module.exports = async (error, req, res, next) => {
    const slackUrl = 'https://hooks.slack.com/services/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'
    slackLoggingService.sendSlackMessage(slackUrl, slackLoggingService.setLogMessage(error))
        .then(ignored => processError(error, res));
}

async function processError (error, res) {
    if (error instanceof UnsupportedOperationError)
        return res.status(400).json(ResponseHelper.toErrorResponse(400, error.message))
    else if (error instanceof UnauthorizedError)
        return res.status(401).json(ResponseHelper.toErrorResponse(401))
    else if (error instanceof NotFoundError)
        return res.status(404).json(ResponseHelper.toErrorResponse(404))
    else {
        const code = error.status || 500
        const message = error.message || 'INTERNAL_SERVER_ERROR'
        return res.status(code).json(ResponseHelper.toErrorResponse(code, message))
    }
}