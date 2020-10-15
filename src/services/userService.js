const User = require('../models/User');
const CompanyUserMapping = require('../models/CompanyUserMapping')
const Company = require('../models/Company')
const CompanySequence = require('../models/CompanySequence')
const Grade = require('../models/Grades');
const bcrypt = require('../helper/bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const readXlsxFile = require("read-excel-file/node");
const emailService = require('../helper/emailService');
const ServiceHelper = require('../helper/ServiceHelper')
const { UnsupportedOperationError, NotFoundError } = require('../models/errors');
const Otp = require('../models/Otp')

const ErrorEnum = {
    EMAIL_INVALID: 'EMAIL_INVALID',
    USER_ALREADY_EXIST: 'USER_ALREADY_EXIST',
    OTP_NOT_FOUND: 'OTP_NOT_FOUND',
    OTP_CODE_NOT_MATCH: 'OTP_CODE_NOT_MATCH'
}

const UserService = {};

UserService.registerEmployees = async (user, path) => {

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

UserService.createUser = async (userDTO, otpCode) => {

    const isEmail = emailService.validateEmail(userDTO.euseremail);

    if (!isEmail)
        throw new UnsupportedOperationError(ErrorUserEnum.EMAIL_INVALID)

    const user = await User.query().where('euseremail', userDTO.euseremail).first();

    if (user)
        throw new UnsupportedOperationError(ErrorUserEnum.USER_ALREADY_EXIST)

    const otp = await Otp.query().where('euseremail', userDTO.euseremail).first();

    if (!otp)
        throw new UnsupportedOperationError(ErrorUserEnum.OTP_NOT_FOUND)

    if (otp.eotpcode !== otpCode)
        throw new UnsupportedOperationError(ErrorUserEnum.OTP_CODE_NOT_MATCH)

    // confirm OTP
    await otp.$query().updateByUserId({ eotpconfirmed: true }, 0);

    userDTO.eusername = userDTO.euseremail.split('@')[0];
    userDTO.euserpassword = await bcrypt.hash(userDTO.euserpassword);
    return User.query().insertToTable(userDTO, 0);

}

UserService.createUser = async (userDTO, user) => {

    const getUserByEmail = await User.query().where('euseremail', userDTO.euseremail).first();

    if (getUserByEmail)
        return

    const trimmedName = userDTO.eusername.replace(/\s+/g, '')

    userDTO.euserpassword = await bcrypt.hash('sportiv'.concat(trimmedName.toLowerCase()));

    const company = await Company.query().findById(user.companyId)

    if (company.ecompanyautonik) {
        const nikNumber = await CompanySequence.getNextVal(company.ecompanyid)
        userDTO.eusernik = company.ecompanynik.concat(nikNumber)
    }

    const createdUser = await User.query().insertToTable(userDTO, user.sub)

    await CompanyUserMapping.query()
        .insertToTable({
            ecompanyecompanyid: user.companyId,
            eusereuserid: createdUser.euserid,
        }, user.sub)

    return createdUser
}

UserService.getUserById = async ( userId, user ) => {

    const result = await User.query()
        .withGraphFetched('file')
        .findById(userId)

    if (!result) return

    const mapping = CompanyUserMapping.query()
        .where('ecompanyecompanyid', user.companyId)
        .where('eusereuserid', userId)

    if (!mapping) return

    return result;

}

UserService.getOtherUserById = async (userId, type, companyId) => {

    const userInCompany = await CompanyUserMapping.
    query()
    .where('ecompanyecompanyid', companyId)
    .where('eusereuserid', userId)
    .first()

    if(!userInCompany) throw new NotFoundError()

    if (type !== 'USER' && type !== 'COACH')
        return

    let relatedIndustry = 'coachIndustries'
    if (type === 'USER')
        relatedIndustry = 'userIndustries'

    return User.query()
    .findById(userId)
    .modify('baseAttributes')
    .withGraphFetched(relatedIndustry)
    .withGraphFetched('experiences(baseAttributes)')
    .withGraphFetched('licenses(baseAttributes)')
    .then(user => {
        if(user === undefined)
            throw new NotFoundError()
        return user
    })

}

UserService.updateUserById = async (userId, userDTO, user) => {

    return User.query().findById(userId)
        .updateByUserId(userDTO, user.sub)
        .returning('*')
}

UserService.generateJWTToken = async (user, companyId) => {

    const config = {
        sub: user.euserid,
        iat: Date.now() / 1000.0,
        email: user.euseremail,
        name: user.eusername,
        mobileNumber: user.eusermobilenumber,
        companyId: companyId
    }
    const token = jwt.sign(config, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });

    return token;

}

UserService.getAllUserByCompanyId = async ( page, size, companyId ) => {

    const userPage = Company.relatedQuery('users')
        .for(companyId)
        .modify('baseAttributes')
        .withGraphFetched('grades(baseAttributes).department(baseAttributes)')
        .page(page, size)
 
    return ServiceHelper.toPageObj(page, size, userPage)

}

UserService.login = async (loginDTO) => {

    const user = await User.query().select().where('euseremail', loginDTO.euseremail).first();

    if (!user)
        throw new NotFoundError()

    const success = await bcrypt.compare(loginDTO.euserpassword, user.euserpassword);

    let token = null;

    if (success === true) {

        const result = await User.query()
        .select('ecompanyecompanyid')
        .joinRelated('companies')
        .where('eusereuserid', user.euserid)
        .orderBy('ecompanyusermappingcreatetime', 'ASC')
        .first();
        token = await UserService.generateJWTToken(user, result.ecompanyecompanyid);

    }

    return token;

}

UserService.changeUserPassword = async ( user , oldPassword, newPassword) => {

    const userFromDB = await User.query().findById(user.sub);

    const samePassword = await bcrypt.compare(oldPassword, userFromDB.euserpassword);

    if (!samePassword)
        throw new UnsupportedOperationError(ErrorEnum.PASSWORD_INVALID);

    const encryptedPassword = await bcrypt.hash(newPassword);

    return userFromDB.$query().updateByUserId({ euserpassword: encryptedPassword }, user.sub);

}

UserService.deleteUserById = async ( userId, loggedInUser ) => {

    const user = await UserService.getUserById(userId, loggedInUser)

    const projects = await User.relatedQuery('projects')
        .for(user.euserid)

    if (projects.length > 0) return false

    return user.$query()
        .delete()
        .then(rowsAffected => rowsAffected === 1)

}

UserService.sendForgotPasswordLink = async ( email ) => {
    const isEmailAvailable = await User.query().select().where('euseremail', email).first();

    if(isEmailAvailable) {
        const userId = isEmailAvailable.euserid;
        await emailService.sendForgotPasswordLink(userId, email);
    }

    return true;
}

module.exports = UserService;