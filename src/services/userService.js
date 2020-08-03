const User = require('../models/User');
const Grade = require('../models/Grades');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const readXlsxFile = require("read-excel-file/node");
const emailService = require('../helper/emailService');
const ServiceHelper = require('../helper/ServiceHelper')

const UsersService = {};

UsersService.registerEmployees = async (user, path) => {

    if (user.permission < 9) return

    let positions = [];
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
            positions.push(row[4].replace(/\w+/g, 
                    function(w){
                        return w[0].toUpperCase() + w.slice(1).toLowerCase();
                    }
                ));
        }

        return values;
    });
    
    const encryptedPasswordValues = values;

    for (const v of encryptedPasswordValues) {
        v.euserpassword = await bcrypt.hash(v.euserpassword);
    }

    const distinctGrade = (value, index, self) => {
        return self.indexOf(value) === index
    }

    const newPositions = positions.filter(distinctGrade);

    const positionList = newPositions.map(newPosition => 
        ({ 
            egradename: newPosition,
            egradecreateby: user.sub,
            ecompanyecompanyid: user.companyId 
        }));  

    await User.query().insert(encryptedPasswordValues);
    await Grade.query().insert(positionList);

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

UsersService.getAllUserByCompanyId = async ( page, size, companyId, user ) => {
    
    const userPage = await User.query().select('eusername', 'euseremail', 'eusernik', 'eusermobilenumber')
    .where('ecompanyecompanyid', companyId).page(page, size);

    if (user.permission < 8 && userPage) return 
 
    return ServiceHelper.toPageObj(page, size, userPage)

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

    const newData = await User.query().patchAndFetchById(user.sub, { euserpassword: encryptedPassword });

    return newData;
}

UsersService.deleteUserById = async ( userId, user ) => {
    
    if (user.permission < 9) return

    const user = await User.query().where('euserid', userId).update({
        euserdeleteby: user.sub,
        euserdeletetime: new Date(Date.now()),
        euserdeletestatus: 1
    });

    return user;

}

UsersService.sendForgotPasswordLink = async ( email ) => {
    const isEmailAvailable = await User.query().select().where('euseremail', email).first();

    if(isEmailAvailable) {
        const userId = isEmailAvailable.euserid;
        await emailService.sendForgotPasswordLink(userId, email);
    }

    return true;
}

module.exports = UsersService;