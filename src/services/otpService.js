const Otp = require('../models/Otp');
const User = require('../models/User');
const otpCodeGenerator = require('../helper/otpCodeGenerator');
const emailService = require('../helper/emailService');
const { UnsupportedOperationError } = require('../models/errors')

const ErrorEnum = {
    EMAIL_INVALID: 'EMAIL_INVALID',
    EMAIL_USED: 'EMAIL_USED',
    OTP_PENDING: 'OTP_PENDING',
    OTP_CONFIRMED: 'OTP_CONFIRMED'
}

const OtpService = {};

OtpService.createOtp = async (email) => {

    const isEmail = await emailService.validateEmail(email);
    
    if (!isEmail)
        throw new UnsupportedOperationError(ErrorEnum.EMAIL_INVALID);

    const otp = Otp.query().where('euseremail', email).first();
    const user = User.query().where('euseremail', email).first();

    const promised = await Promise.all([otp, user]);

    // If email exist in user
    if (promised[1])
        throw new UnsupportedOperationError(ErrorEnum.EMAIL_USED);

    let returnedOtp = {}
    const otpCode = otpCodeGenerator.create4DigitsOTP();
    
    // If otp exist for this email
    if (promised[0]) {

        // If less than one minute passed
        const oneMinute = 60 * 1000;
        if (promised[0].eotpchangetime < (Date.now() - oneMinute))
            throw new UnsupportedOperationError(ErrorEnum.OTP_PENDING);

        // If already confirmed
        if (promised[0].otpcodeconfirmed)
            throw new UnsupportedOperationError(ErrorEnum.OTP_CONFIRMED);

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

    emailService.sendEmailOTP(email, otpCode);

    return 1;

}

module.exports = OtpService;