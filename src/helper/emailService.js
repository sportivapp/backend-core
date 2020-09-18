require('dotenv').config();
const nodemailer = require("nodemailer");
const shortid = require("shortid");
const bcrypt = require('../helper/bcrypt');
const User = require('../models/User');

exports.validateEmail = async (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.toLowerCase().match(re);
}

const smtpConfig = {
    host: process.env.MAIL_SMTPHOST,
    // port: 465, // true for 465, false for other ports
    port: process.env.MAIL_SMTPPORT,
    // secure: process.env.MAIL_SMTPSECURE,
    // secure: true,
    auth: {
        user: process.env.MAIL_SMTPNAME,
        pass: process.env.MAIL_SMTPPASSWORD
    },
    tls: {
        maxVersion: 'TLSv1.2',
        minVersion: 'TLSv1.2'
    }
}

const transporter = nodemailer.createTransport(smtpConfig);

transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

exports.sendEmailOTP = async (email, otpCode) => {

    const html = "Kode OTP: " + otpCode + ". Hati-hati penipuan! Kode OTP ini hanya untuk kamu, jangan <br></br>" +
    "berikan ke siapapun. Pihak Sportiv tidak pernah meminta kode ini.";

    const info = await transporter.sendMail({
        from: process.env.MAIL_SMTPNAME, // sender address
        to: email, // list of receivers
        subject: "Kode OTP - Sportiv", // Subject line
        text: "", // plain text body
        html: html
    });

    transporter.sendMail(info, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log("Email sent!");
    });

}

exports.sendForgotPasswordLink = async (email, link) => {

    const info = await transporter.sendMail({
        from: process.env.MAIL_SMTPNAME, // sender address
        to: email, // list of receivers
        subject: 'Tautan Lupa Kata Sandi - Sportiv', // Subject line
        text: 'Tautan untuk mengganti kata sandi: ' + link, // plain text body
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