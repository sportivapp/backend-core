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

exports.sendForgetEmail = async (email, link) => {

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

exports.sendForgotPasswordLink = async ( userId, email ) => {
    const newPassword = await shortid.generate();
    const encryptedPassword = await bcrypt.hash(newPassword);

    await User.query().patchAndFetchById(userId, { euserpassword: encryptedPassword });

    // const html = 'Forgot password link';

    const info = await transporter.sendMail({
        from: process.env.MAIL_SMTPNAME, // sender address
        to: email, // list of receivers
        subject: 'Forgot Password Code - Sportiv', // Subject line
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

exports.sendReportThread = async (report, callback) => {

    let html
    let type

    if (report.reply) {
        type = 'COMMENT REPLY'
        html = `Report - ${type} <br/><br/>
                Thread Id: ${report.thread.ethreadid}<br/><br/>
                Thread Title: ${report.thread.ethreadtitle}<br/><br/>
                Comment Id: ${report.comment.ethreadpostid}<br/><br/>
                Comment Text: ${report.comment.ethreadpostcomment}<br/><br/>
                Comment Type: ${report.comment.efileefileid ? 'FILE' : 'TEXT'}<br/><br/>
                Comment Reply Id: ${report.reply.ethreadpostreplyid}<br/><br/>
                Comment Reply Text: ${report.reply.ethreadpostreplycomment}<br/><br/>
                Comment Reply Type: ${report.reply.efileefileid ? 'FILE': 'TEXT'}`
    } else if (report.comment) {
        type = 'REPLY THREAD'
        html = `Report - ${type} <br/><br/>
                Thread Id: ${report.thread.ethreadid}<br/><br/>
                Thread Title: ${report.thread.ethreadtitle}<br/><br/>
                Comment Id: ${report.comment.ethreadpostid}<br/><br/>
                Comment Text: ${report.comment.ethreadpostcomment}<br/><br/>
                Comment Type: ${report.comment.efileefileid ? 'FILE' : 'TEXT'}`
    } else {
        type = 'THREAD'
        html = `Report - ${type} <br/><br/>
                Thread Id: ${report.thread.ethreadid}<br/><br/>
                Thread Title: ${report.thread.ethreadtitle}<br/><br/>`
    }

    const info = await transporter.sendMail({
        from: report.reporter.euseremail, // sender address
        to: 'noreply@sportiv.app', // list of receivers
        subject: `REPORT - ${type}`, // Subject line
        text: "", // plain text body
        html: html
    });

    transporter.sendMail(info, callback);
}