const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
const { UnsupportedOperationError } = require('../models/errors');
const companyService = require('./companyService');

const ErrorEnum = {
    UNSUCCESSFUL_LOGIN: 'UNSUCCESSFUL_LOGIN',
    NOT_IN_COMPANY: 'NOT_IN_COMPANY'
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

AuthenticationService.loginCompany = async(companyId, user) => {

    const isInCompany = await companyService.isUserExistInCompany(companyId, user.sub);

    if (!isInCompany) throw new UnsupportedOperationError(ErrorEnum.NOT_IN_COMPANY);

    return AuthenticationService.generateCompanyJWTToken(user);

}

module.exports = AuthenticationService;