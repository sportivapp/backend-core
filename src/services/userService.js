const User = require('../models/User');
const CompanyUserMapping = require('../models/CompanyUserMapping')
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

UsersService.createUser = async (userDTO, permission, user) => {
    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);

    const createdUser = await User.query().insertToTable(userDTO, user.sub)

    let realPermission

    if (!permission) realPermission = 1
    else realPermission = permission

    await CompanyUserMapping.query()
        .insertToTable({
            ecompanyecompanyid: user.companyId,
            eusereuserid: createdUser.euserid,
            ecompanyusermappingpermission: realPermission
        }, user.sub)

    return createdUser
}

UsersService.updateUserById = async (userId, userDTO, permission, user) => {

    if (user.permission != 9 && user.permission != 10) {
        if (userId != user.sub) return
    }

    const userMapping = await CompanyUserMapping.query()
        .where('ecompanyecompanyid', user.companyId)
        .where('eusereuserid', userId)
        .first()

    console.log(userMapping)

    const updateUserQuery = User.query().findById(userId)
        .updateByUserId(userDTO, user.sub)
        .returning('*')

    let realPermission

    if (!permission) realPermission = 1
    else realPermission = permission

    let additionalQuery

    if (userMapping.ecompanyusermappingpermission != realPermission) {
        additionalQuery = CompanyUserMapping.query()
            .where('ecompanyecompanyid', user.companyId)
            .where('eusereuserid', userId)
            .updateByUserId({ ecompanyusermappingpermission: realPermission }, user.sub)
    }

    if (additionalQuery)
        return Promise.all([additionalQuery, updateUserQuery])
            .then(resultArr => resultArr[1])
    else
        return updateUserQuery
}

async function generateJWTToken(user, companyId, permission) {

    const config = {
        sub: user.euserid,
        iat: Date.now() / 1000.0,
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber,
        permission: permission,
        companyId: companyId
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });

    return token;

}

UsersService.getAllUserByCompanyId = async ( page, size, companyId ) => {

    const userPage = await User.query()
    .select('euserid', 'eusername', 'euseremail', 'eusernik', 'eusermobilenumber')
    .joinRelated('companies')
    .where('ecompanyecompanyid', companyId)
    .page(page, size);

    const userIds = userPage.results.map(user => user.euserid);

    const grades = await Grade.query()
    .select('eusereuserid', 'egradename')
    .joinRelated('users')
    .whereIn('eusereuserid', userIds)

    userPage.results.map((user) => {

        const userGrades = grades.filter((grade) => {
            return user.euserid === grade.eusereuserid
        })
        .map((grade) => {
            return grade.egradename;
        });

        user.grades = userGrades;

    })
 
    return ServiceHelper.toPageObj(page, size, userPage)

}

UsersService.login = async (loginDTO) => {

    const user = await User.query().select().where('euseremail', loginDTO.euseremail).first();
    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);

    let token = null;

    if (success === true) {

        const result = await User.query()
        .select('ecompanyecompanyid', 'ecompanyusermappingpermission')
        .joinRelated('companies')
        .where('eusereuserid', user.euserid)
        .orderBy('ecompanyusermappingcreatetime', 'ASC')
        .first();

        token = await generateJWTToken(user, result.ecompanyecompanyid, result.ecompanyusermappingpermission);

    }

    return token;

}

UsersService.changeUserPassword = async ( user , newPassword) => {

    const encryptedPassword = await bcrypt.hash(newPassword);

    const newData = await User.query().patchAndFetchById(user.sub, { euserpassword: encryptedPassword });

    return newData;
}

UsersService.changeUserCompany = async (companyId, user) => {

    const loggedInUser = await User.query().select().where('euseremail', user.email).first();

    const userCompany = await CompanyUserMapping.query().select()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', user.sub)
    .first()

    if(!userCompany)
        return

    let token = null;
    token = await generateJWTToken(loggedInUser, companyId, userCompany.ecompanyusermappingpermission);

    return token;
}


UsersService.deleteUserById = async ( userId, user ) => {
    
    if (user.permission < 9) return

    const result = await User.query()
        .deleteByUserId(user.sub)
        .where('euserid', userId)
        .returning('*');

    return result;

}

UsersService.sendForgotPasswordLink = async ( email ) => {
    const isEmailAvailable = await User.query().select().where('euseremail', email).first();

    if(isEmailAvailable) {
        const userId = isEmailAvailable.euserid;
        await emailService.sendForgotPasswordLink(userId, email);
    }

    return true;
}

UsersService.addApprovalUsers = async (userId, approverUserIds, user) => {
    const users = await User.query()
        .whereIn('euserid', approverUserIds)

    if (users.length !== approvalUserIds.length) return

    const patchDTO = {}
    approverUserIds.forEach((value, index) => {
        patchDTO['euserapprovaluserid'.concat(index)] = value
    })

    return User.query()
        .findById(userId)
        .updateByUserId(patchDTO, user.sub)
        .returning('*')
}

module.exports = UsersService;