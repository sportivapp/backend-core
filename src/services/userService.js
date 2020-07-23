const User = require('../models/User');
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

    console.log(process.env.ACCESS_TOKEN_SECRET);

    const config = {
        sub: user.euserid,
        iat: Date.now() / 1000.0,
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber,
        permission: user.euserpermission,
        companyId: user.ecompanyecompanyid
    }
    const token = jwt.sign(config, 'b901e0023206475b33e682485682f9f1d05dc693b602f75393c036c46676b3658ebed78a9820ba766d6dab58331706fc41d2723ac614b577fd810c3e4137d8ca', { expiresIn: '1800s' });

    return token;

}

UsersService.getAllUserByCompanyId = async ( ecompanyId ) => {
    const users = await User.query().select().where('ecompanyecompanyid', ecompanyId);

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

module.exports = UsersService;