const User = require('../models/User');
const UserChangePassword = require('../models/UserChangePassword');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const readXlsxFile = require("read-excel-file/node");

const UsersService = {};

UsersService.registerEmployees = async (user, path) => {

    const values = await readXlsxFile(path).then((rows) => {
        // skip header
        rows.shift();

        let values = [];

        for (const row of rows) {

            values.push({
                eusernik: row[0],
                eusername: row[1],
                euseremail: row[2],
                eusermobilenumber: row[3].toString(),
                euserpassword: 'emtiv' + row[1],
                ecompanyecompanyid: user.companyId
            });
        }

        return values;
    });

    const encryptedPasswordValues = values;
    for (const v of encryptedPasswordValues) {
        v.euserpassword = await bcrypt.hash(v.euserpassword);
    }

    await User.query().insert(encryptedPasswordValues);

    return values;

}

async function generateJWTToken(user) {

    const config = {
        sub: user.euserid,
        iat: Date.now() / 1000.0,
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber,
        permission: user.euserpermission,
        companyId: user.ecompanyecompanyid
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });

    return token;

}

UsersService.getAllUserByCompanyId = async ( companyId ) => {
    
    const users = await User.query().select('eusername', 'euseremail', 'eusernik', 'eusermobilenumber')
    .where('ecompanyecompanyid', companyId);

    return users;

}

UsersService.login = async (loginDTO) => {

    const user = await User.query().select().where('euseremail', loginDTO.euseremail).first();
    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);

    let token = null;

    if (success === true) {
        token = await generateJWTToken(user);
    }

    return token;

}

UsersService.changeUserPassword = async ( user , newPassword) => {

    const encryptedPassword = await bcrypt.hash(newPassword);

    const newData = await UserChangePassword.query().select().where('euserid', user.sub).update({
        euserpassword: encryptedPassword
    });

    return newData;
}

UsersService.deleteUserById = async ( userId ) => {
    
    const deletedUser = await User.query().select().where('euserid', userId).del();

    return deletedUser;
}

module.exports = UsersService;