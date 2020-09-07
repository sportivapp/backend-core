require('dotenv').config();
const User = require('../models/User');
const CoachIndustryMapping = require('../models/CoachIndustryMapping')
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
const fileService = require('./fileService');
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
    'euserhobby', 'euserfacebook', 'euserinstagram', 'euserlinkedin', 'ecountryname', 'efileefileid', 'euseriscoach')
    .leftJoinRelated('country')
    .where('euserid', userId).first();

    if (!user)
        return

    return user;
    
}

async function updateUserAndIndustries(userFromDB, userDTO, industryIds, user, trx) {

    await userFromDB.$query(trx).updateByUserId(userDTO, user.sub);

    const userIndustryMapping = industryIds.map(industryId => {
        return {
            eusereuserid: userDTO.euserid,
            eindustryeindustryid: industryId
        }
    });

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
            return
    }

    const userFromDB = await UserService.getUserById(user.sub);

    if (!userFromDB)
        return
    
    await User.transaction(async trx => {
        await updateUserAndIndustries(userFromDB, userDTO, industryIds, user, trx);
    })

    return 1;

}

UserService.updateUserCoachData = async (userCoachDTO, user, industryIds) => {

    const userFromDB = await UserService.getUserById(user.sub);

    if (!userFromDB)
        return
    
    userCoachDTO.euserdob = new Date(userCoachDTO.euserdob).getTime();

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

    if (!userFromDB)
        return 

    await CoachIndustryMapping.query()
    .delete()
    .where('eusereuserid', user.sub)

    return userFromDB.$query()
    .updateByUserId({euseriscoach: false}, user.sub);

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