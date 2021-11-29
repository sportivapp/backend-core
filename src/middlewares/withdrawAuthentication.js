require('dotenv').config();
const { UnauthorizedError } = require('../models/errors')

exports.checkWithdrawToken = async (req, res, next) => {
 
    try {
        let withdrawToken = req.headers['s-withdraw-token'];
        if (!withdrawToken) throw new UnauthorizedError();

        if (withdrawToken !== process.env.WITHDRAW_TOKEN)
            throw new UnauthorizedError();
    } catch(e) {
        next(e);
    }
    next();

}