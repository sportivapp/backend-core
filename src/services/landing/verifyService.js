const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require('../../models/errors')

const verifyService = {}

verifyService.verifyCMSToken = async (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true }, async function(err, user) {
        if (err || !user.companyId) {
            throw new UnauthorizedError();
        }
        return token;
    });
}

module.exports = verifyService;