const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
const { UnsupportedOperationError, UnauthorizedError } = require('../models/errors');
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

AuthenticationService.generateCustomJWTToken = async (user, companyId) => {

    const config = {
        uid: user.euserid,
        cid: companyId
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });

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

    const singleUser = await AuthenticationService.checkInCompanyAndGetSingleUser(companyId, user.sub);

    const token = await AuthenticationService.generateCustomJWTToken(singleUser, companyId);

    let link = `org.quickplay.app/login-auto?token=${token}`;
    if (process.env.NODE_ENV === 'production')
        link = process.env.ORG_DOMAIN + `/login-auto?token=${token}`;

    return link;

    // map randomKey:token save to DB
    // return https://organization.quickplay.app/login-auto?token=randomKey

}

AuthenticationService.autoLogin = async(token) => {

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, data) {
        if (err) {
            throw new UnauthorizedError()
        }

        const userId = data.uid;
        const companyId = data.cid;

        const singleUser = await AuthenticationService.checkInCompanyAndGetSingleUser(companyId, userId);

        return AuthenticationService.generateCompanyJWTToken(singleUser, companyId);
    });

}

module.exports = AuthenticationService;