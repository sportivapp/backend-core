require('dotenv').config();
const User = require('../models/User');
const CoachIndustryMapping = require('../models/CoachIndustryMapping')
const UserIndustryMapping = require('../models/UserIndustryMapping')
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
const fileService = require('./fileService');
const Otp = require('../models/Otp');
const emailService = require('../helper/emailService');
const { UnsupportedOperationError, NotFoundError } = require('../models/errors')
const CompanyLogTypeEnum = require('../models/enum/CompanyLogTypeEnum')
const companyLogService = require('../services/companyLogService')

const UserService = {};

const ErrorEnum = {
    NOT_ADMIN: 'NOT_ADMIN',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    INDUSTRY_IS_EMPTY: 'INDUSTRY_IS_EMPTY',
    ALREADY_REGISTERED_AS_COACH: 'ALREADY_REGISTERED_AS_COACH',
    USER_NOT_A_COACH: 'USER_NOT_A_COACH',
    WRONG_PASSWORD: 'WRONG_PASSWORD',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    EMAIL_NOT_FOUND :'EMAIL_NOT_FOUND',
    EMAIL_INVALID : 'EMAIL_INVALID',
    USER_ALREADY_EXIST : 'USER_ALREADY_EXIST',
    OTP_NOT_FOUND : 'OTP_NOT_FOUND',
    OTP_CODE_NOT_MATCH : 'OTP_CODE_NOT_MATCH',
    OTP_EXPIRED: 'OTP_EXPIRED',
}

async function generateJWTToken(user) {

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

UserService.login = async (loginDTO) => {

    const user = await User.query().where('euseremail', loginDTO.euseremail).first();

    if (!user) throw new NotFoundError()

    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);

    if (!success) throw new NotFoundError()

    return await generateJWTToken(user);

}

UserService.createUser = async (userDTO, otpCode) => {

    const isEmail = emailService.validateEmail(userDTO.euseremail);
    if (!isEmail)
        throw new UnsupportedOperationError(ErrorEnum.EMAIL_INVALID)
    const user = await User.query().where('euseremail', userDTO.euseremail).first();
    if (user)
        throw new UnsupportedOperationError(ErrorEnum.USER_ALREADY_EXIST)
    const otp = await Otp.query().where('euseremail', userDTO.euseremail).first();
    if (!otp)
        throw new UnsupportedOperationError(ErrorEnum.OTP_NOT_FOUND)
    if (otp.eotpcode !== otpCode)
        throw new UnsupportedOperationError(ErrorEnum.OTP_CODE_NOT_MATCH)
    const fifteenMinutes = 15 * 60 * 1000;
    if ((Date.now() - otp.eotpchangetime) > fifteenMinutes)
        throw new UnsupportedOperationError(ErrorEnum.OTP_EXPIRED);

    // confirm OTP
    await otp.$query().updateByUserId({ eotpconfirmed: true }, 0);

    userDTO.eusername = userDTO.euseremail.split('@')[0];
    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
    return User.query().insertToTable(userDTO, 0);

}

UserService.getUserById = async (userId) => {

    const user = await User.query()
    .findById(userId)
    .modify('baseAttributes')
    .first();

    if (!user)
        throw new NotFoundError()

    return user;
    
}

UserService.getOtherUserById = async (userId, type) => {

    if (type !== 'USER' && type !== 'COACH')
        return

    let relatedIndustry = 'coachIndustries(baseAttributes)'
    if (type === 'USER')
        relatedIndustry = 'userIndustries(baseAttributes)'

    return User.query()
    .findById(userId)
    .modify('baseAttributes')
    .withGraphFetched(relatedIndustry)
    .withGraphFetched('companies(baseAttributes)')
    .withGraphFetched('teams(baseAttributes)')
    .withGraphFetched('experiences(baseAttributes)')
    .withGraphFetched('licenses(baseAttributes)')
    .then(user => {
        if(user === undefined)
            throw new NotFoundError()
        return user
    });

}

async function updateUserAndIndustries(userFromDB, userDTO, industryIds, user, trx) {

    await userFromDB.$query(trx).updateByUserId(userDTO, user.sub);

    const userIndustryMapping = industryIds.map(industryId => {
        return {
            eusereuserid: userDTO.euserid,
            eindustryeindustryid: industryId
        }
    });

    await UserIndustryMapping.query().where('eusereuserid', user.sub).delete();

    return userFromDB.$relatedQuery('userIndustriesMapping', trx).insertToTable(userIndustryMapping, user.sub);

}

UserService.updateUser = async (userDTO, industryIds, user) => {

    // efileefileid null if undefined or 0 was sent
    if (userDTO.efileefileid === undefined || userDTO.efileefileid === 0) {
        userDTO.efileefileid = null;
    } else {
        // Check whether the user uses self created file
        const file = await fileService.getFileByIdAndCreateBy(userDTO.efileefileid, user.sub);

        if (!file)
            throw new UnsupportedOperationError(ErrorEnum.FILE_NOT_FOUND)
    }

    const userFromDB = await UserService.getUserById(user.sub);

    if (!userFromDB)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_EXIST)
    
    // Update user only
    if (industryIds.length === 0) {
        await userFromDB.$query().updateByUserId(userDTO, user.sub);
    } else {
        // Update user and industry
        await User.transaction(async trx => {
            await updateUserAndIndustries(userFromDB, userDTO, industryIds, user, trx);
        })
    }

    return 1;

}

UserService.updateUserCoachData = async (userCoachDTO, user, industryIds) => {

    const userFromDB = await UserService.getUserById(user.sub);

    if (userFromDB.euseriscoach)
        throw new UnsupportedOperationError(ErrorEnum.ALREADY_REGISTERED_AS_COACH) 

    const coachIndustryMappings = industryIds.map(industryId => ({
        eindustryeindustryid: industryId,
        eusereuserid: user.sub
    }))

    const updatedUser = userFromDB.$query().updateByUserId(userCoachDTO, user.sub);

    const insertedMapping = CoachIndustryMapping.query()
    .insertToTable(coachIndustryMappings, user.sub)

    return Promise.all([updatedUser, insertedMapping])
    .then(arr => arr[0])

}

UserService.removeCoach = async (user) => {

    const userFromDB = await UserService.getUserById(user.sub);

    if (userFromDB.euseriscoach === false)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_A_COACH)

    await CoachIndustryMapping.query()
    .delete()
    .where('eusereuserid', user.sub)

    return userFromDB.$query()
    .updateByUserId({euseriscoach: false}, user.sub);

}

UserService.changePassword = async (oldPassword, newPassword, user) => {

    const userFromDB = await User.query().where('euserid', user.sub).first();

    if (!userFromDB)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_EXIST)

    const checkOldPassword = await bcrypt.compare(oldPassword, userFromDB.euserpassword);

    if (!checkOldPassword)
        throw new UnsupportedOperationError(ErrorEnum.WRONG_PASSWORD)
    
    const hashedNewPassword = await bcrypt.hash(newPassword);

    return userFromDB.$query().updateByUserId({euserpassword: hashedNewPassword}, user.sub);

}

UserService.getIndustryByUserId = async (user, type) => {

    await UserService.getUserById(user.sub)

    if(type === 'USER') {

        return UserIndustryMapping.query()
            .select('eindustryid', 'eindustryname')
            .joinRelated('industry')
            .where('eusereuserid', user.sub);

    } else if ( type === 'COACH') {

        return CoachIndustryMapping.query()
            .select('eindustryid', 'eindustryname')
            .joinRelated('industry')
            .where('eusereuserid', user.sub);
    }

}

UserService.changeIndustryByUserId = async (user, type, industryIds) => {

    await UserService.getUserById(user.sub)

    if(industryIds.length <= 0) 
        throw new UnsupportedOperationError(ErrorEnum.INDUSTRY_IS_EMPTY)

    const mapping = industryIds.map(industryId => ({
        eusereuserid: user.sub,
        eindustryeindustryid: industryId
    }))

    if(type === 'USER') {

        return UserIndustryMapping.query()
            .delete()
            .where('eusereuserid', user.sub)
            .then(ignore => {
                    return UserIndustryMapping.query()
                    .insertToTable(mapping, user.sub)
                })

    } else if ( type === 'COACH') {

        return CoachIndustryMapping.query()
            .delete()
            .where('eusereuserid', user.sub)
            .then(ignore => {
                    return CoachIndustryMapping.query()
                    .insertToTable(mapping, user.sub)
                })
    }

}

UserService.getListPendingByUserId = async (page, size, userId, type, sortType) => {

    const userFromDB = User.query()
        .select()
        .where('euserid', userId)
        .first()
    
    if(!userFromDB)
        throw new UnsupportedOperationError(ErrorEnum.USER_NOT_EXIST)

    if( type !== CompanyLogTypeEnum.INVITE && type !== CompanyLogTypeEnum.APPLY)
        throw new NotFoundError()

    return companyLogService.getListPendingByUserId(userId, type, sortType, page, size)

}

module.exports = UserService;