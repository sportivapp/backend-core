require('dotenv').config();
const nodemailer = require("nodemailer");
const shortid = require("shortid")

const smtpConfig = {
    host: process.env.MAIL_SMTPHOST,
    port: 465, // true for 465, false for other ports
    //process.env.MAIL_SMTPPORT,
    //secure: process.env.MAIL_SMTPSECURE, 
    secure: true,
    auth: {
        user: process.env.MAIL_SMTPNAME,
        pass: process.env.MAIL_SMTPPASSWORD
    },
    tls: {
        maxVersion: 'TLSv1.3',
        minVersion: 'TLSv1.2'
    }
}

const transporter = nodemailer.createTransport(smtpConfig);

exports.sendForgotPasswordLink = async ( userEmail ) => {
    const newPassword = shortid.generate();
    const encryptedPassword = await bcrypt.hash(newPassword);

    await UserChangePassword.query().select().where('euseremail', userEmail).update({
        euserpassword: encryptedPassword
    });

    // const html = 'Forgot password link';

    const info = await transporter.sendMail({
        from: process.env.MAIL_SMTPNAME, // sender address
        to: userEmail, // list of receivers
        subject: 'Forgot Password Code - Nawakara', // Subject line
        text: 'Berikut adalah password baru kamu: ' + newPassword, // plain text body
        // html: html
    });

    transporter.sendMail(info, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log("Email sent!");
    });

    return true;
}