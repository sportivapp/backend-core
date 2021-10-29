require('dotenv').config();
const { UnauthorizedError } = require('../models/errors')

exports.checkCallbackToken = async (req, res, next) => {
 
    try {
        let callbackToken = req.headers['x-callback-token'];
        if (!callbackToken) throw new UnauthorizedError();

        if (callbackToken !== process.env.CORE_CALLBACK_TOKEN)
            throw new UnauthorizedError();
    } catch(e) {
        next(e);
    }
    next();

}