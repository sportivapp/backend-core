const Otp = require('../models/Otp');
const User = require('../models/User');
const otpCodeGenerator = require('../helper/otpCodeGenerator');

const OtpService = {};

OtpService.createOtp = async (email) => {

    const otp = Otp.query().where('euseremail', email).first();
    const user = User.query().where('euseremail', email).first();

    const promised = await Promise.all([otp, user])
    .then();

    // If email exist in user
    if (promised[1])
        return

    // If otp confirmed
    if (promised[0].otpcodeconfirmed)
        return

    const otpCode = otpCodeGenerator.create4DigitsOTP();

    let otp = {}
    // If email exist in otp
    if (promised[0]) {
        otp = await promised[0].$query().updateByUserId({ eotpcode: otpCode }, 0).returning('*');
    } else {
        otp = await Otp.query().insertToTable({
            eotpcode: otpCode,
            euseremail: email
        }, 0);
    }

    // emailService.sendOtpToEmail(email);

    return otp;

}

module.exports = OtpService;