const Users = require('../models/Users');
const bcrypt = require('../helper/bcrypt');

const UsersService = {};

UsersService.createUser = async (userDTO) => {

    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);

    const user = await Users.query().insert(userDTO);

    return user;

}

module.exports = UsersService;