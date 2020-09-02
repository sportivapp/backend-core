require('dotenv').config();
const User = require('../models/User');
const UserIndustryMapping = require('../models/UserIndustryMapping')
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
const fileService = require('./mobileFileService');
const Otp = require('../models/Otp');
const emailService = require('../helper/emailService');

const UserService = {};

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

    if (!user)
        return

    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);

    if (!success)
        return

    return await generateJWTToken(user);

}

UserService.createUser = async (userDTO, otpCode) => {

    const isEmail = emailService.validateEmail(userDTO.euseremail);

    if (!isEmail)
        return 'invalid email'

    const user = await User.query().where('euseremail', userDTO.euseremail).first();

    if (user)
        return 'user exist'

    const otp = await Otp.query().where('euseremail', userDTO.euseremail).first();

    if (!otp)
        return 'no otp found'

    if (otp.eotpcode !== otpCode)
        return 'otp code not match'

    // confirm OTP
    await otp.$query().updateByUserId({ eotpconfirmed: true }, 0);

    userDTO.eusername = userDTO.euseremail.split('@')[0];
    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
    return User.query().insert(userDTO);

}

UserService.getUserById = async (userId) => {

    const user = await User.query()
    .select('euserid', 'eusername', 'eusermobilenumber', 'euseremail', 'euseridentitynumber', 'euserdob', 'euseraddress', 'eusergender', 
    'euserhobby', 'euserfacebook', 'euserinstagram', 'euserlinkedin', 'ecountryname', 'efileefileid')
    .leftJoinRelated('country')
    // .leftJoinRelated('efile')
    .where('euserid', userId).first();

    if (!user)
        return

    return user;
    
}

UserService.updateUser = async (userDTO, user) => {

    // efileefileid null if undefined or 0 was sent
    if (userDTO.efileefileid === undefined || userDTO.efileefileid === 0) {
        userDTO.efileefileid = null;
    }

    const userFromDB = await UserService.getUserById(user.sub);

    if (!user)
        return
    
    userDTO.euserdob = new Date(userDTO.euserdob).getTime();

    const updatedUser = await userFromDB.$query().updateByUserId(userDTO, user.sub).returning('*');

    return 1;

}

UserService.updateUserCoachData = async (userCoachDTO, user, industries) => {

    // efileefileid null if undefined or 0 was sent
    if (userCoachDTO.efileefileid === undefined || userCoachDTO.efileefileid === 0) {
        userCoachDTO.efileefileid = null;
    }

    const userFromDB = await UserService.getUserById(user.sub);

    if (!userFromDB)
        return
    
    userCoachDTO.euserdob = new Date(userCoachDTO.euserdob).getTime();

    const mapping = industries.map(industry => ({
        eindustryeindustryid: industry,
        eusereuserid: user.sub
    }))

    const updatedUser = userFromDB.$query().updateByUserId(userCoachDTO, user.sub);

    const insertedMapping = UserIndustryMapping.query()
    .insertToTable(mapping, user.sub)

    return Promise.all([updatedUser, insertedMapping])
    .then(arr => arr[0])
    .then(rowsAffected => rowsAffected === 1)

}

UserService.changePassword = async (oldPassword, newPassword, user) => {

    const userFromDB = await User.query().where('euserid', user.sub).first();

    if (!userFromDB)
        return 'no user'

    const checkOldPassword = await bcrypt.compare(oldPassword, userFromDB.euserpassword);

    if (!checkOldPassword)
        return 'wrong password'
    
    const hashedNewPassword = await bcrypt.hash(newPassword);

    return userFromDB.$query().updateByUserId({euserpassword: hashedNewPassword}, user.sub);

}

module.exports = UserService;