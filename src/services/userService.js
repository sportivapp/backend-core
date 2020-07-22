const User = require('../models/User');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const UsersService = {};

// UsersService.createUser = async (userDTO) => {

//     userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);

//     const user = await Users.query().insert(userDTO);

//     return user;

// }

UsersService.login = async (loginDTO) => {

    const user = await User.query().select().where('euseremail', loginDTO.euseremail).first();
    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);

    let token = null;

    if (success === true) {
        token = await generateJWTToken(user);
    }

    return token;

}

async function generateJWTToken(user) {

    const config = {
        sub: user.euserid,
        iat: Date.now() / 1000.0,
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber,
        permission: user.euserpermission
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });

    return token;

}

module.exports = UsersService;