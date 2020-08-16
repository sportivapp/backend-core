const jwt = require("jsonwebtoken");
require('dotenv').config();
const ResponseHelper = require('../helper/ResponseHelper')

exports.authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader //&& authHeader.split(' ')[1];
    if (token === null) return res.status(401).json("You need to log in first.");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, user) {
        if (err) { 
            return res.status(401).json("You need to log in first.");
        }
        req.user = user;
        next();
    });

}