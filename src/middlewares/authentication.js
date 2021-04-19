const jwt = require("jsonwebtoken");
require('dotenv').config();
const { UnauthorizedError } = require('../models/errors')
const ResponseHelper = require('../helper/ResponseHelper')
const profileService = require('../services/profileService')
const jwtService = require('../services/common/jwtService')

exports.authenticateToken = async (req, res, next) => {
 
    let token = req.headers['authorization'];

    if (!token) token = req.cookies.tok;

    if (!token) next(new UnauthorizedError())

    const user = await jwtService.verify(token, true)
        .catch(() => next(new UnauthorizedError()));

    req.user = user;
    if (!req.user.companyId) req.user.functions = ['R1']
    else req.user.functions = await profileService.getFunctionCodes(user)
    next();

}

exports.authenticateTokenIfExist = async (req, res, next) => {

    let token = req.headers['authorization'];

    if (!token) token = req.cookies.tok;

    if (token) {

        const user = await jwtService.verify(token, true)
            .catch(() => next(new UnauthorizedError()));

        req.user = user;
        if (!req.user.companyId) req.user.functions = ['R1']
        else req.user.functions = await profileService.getFunctionCodes(user)
        next();

    } else next();

}