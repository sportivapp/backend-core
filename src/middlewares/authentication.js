const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

exports.authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader //&& authHeader.split(' ')[1];
    if (token === null) return res.status(401).json("You need to log in first.");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
        if (err) { 

            if (err.name === jwt.TokenExpiredError) return res.status(400).json('Token expired');

            return res.status(403).json('Unauthorized access');
        }
        req.user = user;
        next();
    });

}