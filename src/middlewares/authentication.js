const jwt = require("jsonwebtoken");
require('dotenv').config();
const { UnauthorizedError } = require('../models/errors')
const ResponseHelper = require('../helper/ResponseHelper')
const profileService = require('../services/profileService')

exports.authenticateToken = async (req, res, next) => {
 
    let token = req.headers['authorization'];

    if (!token) token = req.cookies.tok;

    if (!token) next(new UnauthorizedError())

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true }, async function(err, user) {
        if (err) {
            next(new UnauthorizedError())
        }
        req.user = user;
        if (!req.user.companyId) req.user.functions = ['R1']
        else req.user.functions = await profileService.getFunctionCodes(user)
        next();
    });

}

exports.authenticateTokenIfExist = async (req, res, next) => {

    let token = req.headers['authorization'];

    if (!token) token = req.cookies.tok;

    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true }, async function(err, user) {
            if (err) {
                next(new UnauthorizedError())
            }
            req.user = user;
            if (!req.user.companyId) req.user.functions = ['R1']
            else req.user.functions = await profileService.getFunctionCodes(user)
            next();
        });
    } else next();

}