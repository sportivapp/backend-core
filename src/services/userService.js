const Users = require('../models/Users');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jwt-simple');

const UsersService = {};

UsersService.createUser = async (userDTO) => {

    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);

    const user = await Users.query().insert(userDTO);

    return user;

}

UsersService.login = async (loginDTO) => {

    const user = await Users.query().select().where('euseremail', loginDTO.euseremail).first();
    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);
    console.log(user);
    console.log(success);

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
    const token = jwt.encode(config, process.env.SECRET || 'test');

    return token;

}

module.exports = UsersService;