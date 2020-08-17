require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
const fileService = require('./mobileFileService');

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

UserService.createUser = async (userDTO) => {

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

    if (userDTO.efileefileid === undefined || userDTO.efilefileid === 0) {
        userDTO.efilefileid = null;
    }

    const userFromDB = await UserService.getUserById(user.sub);

    if (!user)
        return
    
    userDTO.euserdob = new Date(userDTO.euserdob).getTime();

    const updatedUser = await userFromDB.$query().updateByUserId(userDTO, user.sub).returning('*');

    // There is no file
    if (userDTO.efileefileid === null) {
        // There is a file on user, then delete it
        if (updatedUser.efileefileid !== null) {
            await fileService.deleteFileByIdAndCreateBy(updatedUser.efileefileid, updatedUser.euserid);
        }
    }
    // There is a file
    else if (userDTO.efileefileid !== null) {

        // File does not exist / not uploaded yet
        const file = await fileService.getFileByIdAndCreateBy(userDTO.efileefileid, user.sub);

        if (!file)
            return

        const newPathDir = '/user/' + updatedUser.euserid;
        await fileService.moveFile(file, newPathDir);
    }

    return 1;

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