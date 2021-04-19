require('dotenv').config();
const { UnauthorizedError } = require('../models/errors')

exports.checkAPIKey = async (req, res, next) => {
 
    try {
        let apiKey = req.headers['x-api-key'];
        if (!apiKey) throw new UnauthorizedError();

        if (apiKey !== process.env.CORE_API_KEY)
            throw new UnauthorizedError();
    } catch(e) {
        next(e);
    }
    next();

}