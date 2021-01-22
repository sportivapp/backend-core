const User = require('../models/User');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const Company = require('../models/Company')
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const emailService = require('../helper/emailService');
const ServiceHelper = require('../helper/ServiceHelper')
const firebaseService = require('../helper/firebaseService')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const Otp = require('../models/Otp')

const ErrorEnum = {
    EMAIL_INVALID: 'EMAIL_INVALID',
    USER_ALREADY_EXIST: 'USER_ALREADY_EXIST',
    OTP_NOT_FOUND: 'OTP_NOT_FOUND',
    OTP_CODE_NOT_MATCH: 'OTP_CODE_NOT_MATCH',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    UNSUCCESSFUL_LOGIN: 'UNSUCCESSFUL_LOGIN'
}



const UserService = {};

UserService.register = async (userDTO, otpCode) => {

    const isEmail = emailService.validateEmail(userDTO.euseremail);
    if (!isEmail)
        throw new UnsupportedOperationError(ErrorUserEnum.EMAIL_INVALID)
    const user = await User.query().where('euseremail', userDTO.euseremail).first();
    if (user)
        throw new UnsupportedOperationError(ErrorUserEnum.USER_ALREADY_EXIST)
    const otp = await Otp.query().where('euseremail', userDTO.euseremail).first();
    if (!otp)
        throw new UnsupportedOperationError(ErrorUserEnum.OTP_NOT_FOUND)
    if (otp.eotpcode !== otpCode)
        throw new UnsupportedOperationError(ErrorUserEnum.OTP_CODE_NOT_MATCH)

    // confirm OTP
    await otp.$query().updateByUserId({ eotpconfirmed: true }, 0);

    userDTO.eusername = userDTO.euseremail.split('@')[0];
    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
    return User.query().insertToTable(userDTO, 0);

}

UserService.getSingleUserById = async (userId) => {

    return User.query()
        .modify('baseAttributes')
        .withGraphFetched('file')
        .findById(userId)
        .then(user => {
            if (!user) throw UnsupportedOperationError(ErrorEnum.USER_NOT_FOUND);
            return user;
        });

}

UserService.getUserById = async ( userId, user ) => {

    const result = await User.query()
        .withGraphFetched('file')
        .findById(userId)

    if (!result) return

    const mapping = CompanyUserMapping.query()
        .where('ecompanyecompanyid', user.companyId)
        .where('eusereuserid', userId)

    if (!mapping) return

    return result;

}

UserService.getOtherUserById = async (userId, type, companyId) => {

    const userInCompany = await CompanyUserMapping.
    query()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', userId)
    .first()

    // if(!userInCompany) throw new NotFoundError()

    if (type !== 'USER' && type !== 'COACH')
        return

    let relatedIndustry = 'coachIndustries'
    if (type === 'USER' || !userInCompany)
        relatedIndustry = 'userIndustries'

    return User.query()
    .findById(userId)
    .modify('baseAttributes')
    .withGraphFetched(relatedIndustry)
    .withGraphFetched('experiences(baseAttributes)')
    .withGraphFetched('licenses(baseAttributes)')
    .then(user => {
        if(user === undefined)
            throw new NotFoundError()
        return user
    })

}

UserService.updateUserById = async (userId, userDTO, user) => {

    return User.query().findById(userId)
        .updateByUserId(userDTO, user.sub)
        .returning('*')
}

UserService.generateJWTToken = async (user, companyId) => {

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

UserService.getAllUserByCompanyId = async ( page, size, companyId ) => {

    const userPage = Company.relatedQuery('users')
        .for(companyId)
        .modify('baseAttributes')
        .withGraphFetched('grades(baseAttributes).department(baseAttributes)')
        .page(page, size)
 
    return ServiceHelper.toPageObj(page, size, userPage)

}

UserService.login = async (loginDTO) => {

    const user = await User.query().select().where('euseremail', loginDTO.euseremail).first();

    if (!user)
        throw new NotFoundError()

    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);

    let token = null;

    if (!success) throw new UnsupportedOperationError(ErrorEnum.UNSUCCESSFUL_LOGIN)

    if (success === true) {

        const result = await User.query()
        .select('ecompanyecompanyid')
        .joinRelated('companies')
        .where('eusereuserid', user.euserid)
        .orderBy('ecompanyusermappingcreatetime', 'ASC')
        .first();
        token = await UserService.generateJWTToken(user, result.ecompanyecompanyid);

        // firebaseService.pushNotification(user.euserid, 'Login Successful',
        //     `Login Successful for email ${user.euseremail}`)
    }

    return token;

}

UserService.changeUserPassword = async ( user , oldPassword, newPassword) => {

    const userFromDB = await User.query().findById(user.sub);

    const samePassword = await bcrypt.compare(oldPassword, userFromDB.euserpassword);

    if (!samePassword)
        throw new UnsupportedOperationError(ErrorEnum.PASSWORD_INVALID);

    const encryptedPassword = await bcrypt.hash(newPassword);

    return userFromDB.$query().updateByUserId({ euserpassword: encryptedPassword }, user.sub);

}

UserService.deleteUserById = async ( userId, loggedInUser ) => {

    const user = await UserService.getUserById(userId, loggedInUser)

    const projects = await User.relatedQuery('projects')
        .for(user.euserid)

    if (projects.length > 0) return false

    return user.$query()
        .delete()
        .then(rowsAffected => rowsAffected === 1)

}

UserService.sendForgotPasswordLink = async ( email ) => {
    const isEmailAvailable = await User.query().select().where('euseremail', email).first();

    if(isEmailAvailable) {
        const userId = isEmailAvailable.euserid;
        await emailService.sendForgotPasswordLink(userId, email);
    }

    return true;
}

UserService.getAllUsersByUserIds = async (userIds) => {
    return User.query()
        .whereIn('euserid', userIds)
}

module.exports = UserService;