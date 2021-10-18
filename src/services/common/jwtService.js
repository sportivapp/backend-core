const jwt = require('jsonwebtoken')

const jwtService = {};

jwtService.sign = async (payload, expiresIn) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: expiresIn });
}

jwtService.verify = async (token, ignoreExpiration) => {
    return new Promise((resolve, reject) => {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: ignoreExpiration }, function (err, data) {
            if (err) return reject(err);
            resolve(data);
        });
    });

}

module.exports = jwtService;