const Forget = require('../models/Forget');
const User = require('../models/User');
const emailService = require('../helper/emailService');
const { UnsupportedOperationError } = require('../models/errors')
require('dotenv').config();
const cryptojs = require('crypto-js');

const ErrorEnum = {
    EMAIL_INVALID: 'EMAIL_INVALID',
    TOKEN_INVALID: 'TOKEN_INVALID',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED'
}

const ForgetService = {};

ForgetService.sendForgetEmail = async (email) => {

    const isEmail = await emailService.validateEmail(email);
    
    if (!isEmail)
        throw new UnsupportedOperationError(ErrorEnum.EMAIL_INVALID);

    const user = await User.query().where('euseremail', email).first();

    if (!user)
        return

    const forget = await Forget.query().where('euseremail', email).first();
    
    // Generate random token
    const token = [...Array(22)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
    const tokenValue = Date.now() + ':' + token;
    const encryptedValue = cryptojs.AES.encrypt(tokenValue, email + process.env.FORGET_SECRET).toString();
    const link = 'https://org.sportiv.app/changePassword/' + token + '/' + email;
    
    if (forget) {
        await forget.$query().updateByUserId({
            eforgetvalue: encryptedValue
        }, 0)
    } else {
        await Forget.query().insertToTable({
            euseremail: email,
            eforgetvalue: encryptedValue
        }, 0);
    }

    emailService.sendForgetEmail(email, link);

    return true;

}

ForgetService.checkForgetLink = async (token, email) => {

    const forget = await Forget.query().where('euseremail', email).first();

    if (!forget)
        throw new UnsupportedOperationError(ErrorEnum.TOKEN_INVALID);

    let tokenValue;

    try {
        const bytes = cryptojs.AES.decrypt(forget.eforgetvalue, email + process.env.FORGET_SECRET);
        tokenValue = bytes.toString(cryptojs.enc.Utf8);
    } catch(e) {
        throw new UnsupportedOperationError(ErrorEnum.TOKEN_INVALID);
    }
    
    const splittedToken = tokenValue.split(':');

    if (splittedToken.length !== 2)
        throw new UnsupportedOperationError(ErrorEnum.TOKEN_INVALID);

    const thirtyMinute = 30 * 60 * 1000;
    if (splittedToken[0] < (Date.now() - thirtyMinute))
        throw new UnsupportedOperationError(ErrorEnum.TOKEN_EXPIRED);

    if (splittedToken[1] !== token)
        throw new UnsupportedOperationError(ErrorEnum.TOKEN_INVALID);
    
    return true;

}

ForgetService.setPassword = async (token, email, newPassword) => {

    await ForgetService.checkLinkValidity(token, email);
    
    const user = await User.query().where('euseremail', email);

    const encryptedPassword = await bcrypt.hash(newPassword);
    user.$query().updateByUserId({ euserpassword: encryptedPassword }, user.sub);

    return Forget.query()
    .where('euseremail', email)
    .where('eforgotvalue', token)
    .delete()
    .then(rowsAffected => rowsAffected === 1);

}

module.exports = ForgetService;