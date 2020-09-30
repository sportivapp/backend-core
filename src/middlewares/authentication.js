const jwt = require("jsonwebtoken");
require('dotenv').config();
const ResponseHelper = require('../helper/ResponseHelper')
const profileService = require('../services/profileService')

exports.authenticateToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader //&& authHeader.split(' ')[1];
    if (token === null) return res.status(401).json("You need to log in first.");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true }, async function(err, user) {
        if (err) { 
            return res.status(401).json("You need to log in first.");
        }
        req.user = user;
        if (!req.user.companyId) req.user.functions = ['R1']
        else req.user.functions = await profileService.getFunctionCodes(user)
        next();
    });

}