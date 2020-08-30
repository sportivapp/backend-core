const Otp = require('../models/Otp');
const User = require('../models/User');
const otpCodeGenerator = require('../helper/otpCodeGenerator');
const emailService = require('../helper/emailService');

const OtpService = {};

OtpService.createOtp = async (email) => {

    const isEmail = await emailService.validateEmail(email);
    
    if (!isEmail)
        return 'invalid email'

    const otp = Otp.query().where('euseremail', email).first();
    const user = User.query().where('euseremail', email).first();

    const promised = await Promise.all([otp, user])
    .then();

    // If email exist in user
    if (promised[1])
        return 'email used'

    let returnedOtp = {}
    const otpCode = otpCodeGenerator.create4DigitsOTP();
    
    // If otp exist for this email
    if (promised[0]) {

        console.log((promised[0].otpcodechangetime - Date.now()));
        // If less than one minute passed
        if ((promised[0].otpcodechangetime - Date.now()) < 60000)
            return 'you need to wait'

        // If already confirmed
        if (promised[0].otpcodeconfirmed)
            return 'otp already confirmed'

        // resend Otp
        returnedOtp = await promised[0].$query().updateByUserId({ eotpcode: otpCode }, 0).returning('*');
    } 

    // If otp does not exist for this email
    if (!promised[0]) {

        returnedOtp = await Otp.query().insertToTable({
            eotpcode: otpCode,
            euseremail: email
        }, 0);

    }

    await emailService.sendEmailOTP(email, otpCode);

    return returnedOtp;

}

module.exports = OtpService;