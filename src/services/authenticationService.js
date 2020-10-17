const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
const { UnsupportedOperationError } = require('../models/errors');
const companyService = require('./companyService');
const userService = require('./userService');

const ErrorEnum = {
    UNSUCCESSFUL_LOGIN: 'UNSUCCESSFUL_LOGIN',
    NOT_IN_COMPANY: 'NOT_IN_COMPANY',
    USER_NOT_FOUND: 'USER_NOT_FOUND'
}

const AuthenticationService = {};

AuthenticationService.generateJWTToken = async(user) => {

    const config = {
        sub: user.euserid,
        iat: Math.round(Date.now() / 1000.0),
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET); // , { expiresIn: '1800s' }

    return token;

}

AuthenticationService.login = async (loginDTO) => {

    const user = await User.query().where('euseremail', loginDTO.email).first();

    if (!user) throw new UnsupportedOperationError(ErrorEnum.UNSUCCESSFUL_LOGIN);

    const success = await bcrypt.compare(loginDTO.password, user.euserpassword);

    if (!success) throw new UnsupportedOperationError(ErrorEnum.UNSUCCESSFUL_LOGIN)

    return AuthenticationService.generateJWTToken(user);

}

AuthenticationService.generateCompanyJWTToken = async (user, companyId) => {

    const config = {
        sub: user.euserid,
        iat: Date.now() / 1000.0,
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber,
        companyId: companyId
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });

    return token;

}

AuthenticationService.checkInCompanyAndGetSingleUser = async (companyId, userId) => {

    const isInCompany = await companyService.isUserExistInCompany(companyId, userId);

    if (!isInCompany) throw new UnsupportedOperationError(ErrorEnum.NOT_IN_COMPANY);

    return userService.getSingleUserById(userId)
        .then(singleUser => {
            if (!singleUser) throw new UnsupportedOperationError(ErrorEnum.USER_NOT_FOUND);
            return singleUser;
        });

}

AuthenticationService.loginCompany = async(companyId, user) => {

    const singleUser = AuthenticationService.checkInCompanyAndGetSingleUser(companyId, user.sub);

    const token = await AuthenticationService.generateCompanyJWTToken(singleUser, companyId);

    return process.env.ORG_DOMAIN + `/api/v1/login-auto?token=${token}&companyId=${companyId}`

    // map randomKey:token save to DB
    // return https://organization.quickplay.app/login-auto?token=randomKey&companyId=1

}

AuthenticationService.autoLogin = async(token, companyId) => {

    let userId = null;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true }, async function(err, user) {
        if (err) { 
            return res.status(401).json("You need to log in first.");
        }

        userId = user.sub;

    });

    const singleUser = AuthenticationService.checkInCompanyAndGetSingleUser(companyId, userId);

    return AuthenticationService.generateCompanyJWTToken(singleUser, companyId);

}

module.exports = AuthenticationService;