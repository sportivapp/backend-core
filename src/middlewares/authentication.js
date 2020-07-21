const jwt = require("jwt-simple");
const secret = require("../secret/appsecret").secret;

exports.authToken = async (req, res, next) => {

    const token = req.headers.authorization;
    if (!token) return res.status(401).send("You need to log in first.");

    let user = new Object();
    try {
        user = jwt.decode(token, secret, false, 'HS256');
    } catch(e) {
        return res.status(401).json(e.stack);
    }

    req.user = user;
    next();
}