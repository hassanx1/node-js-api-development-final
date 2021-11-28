"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (options) =>{
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
   const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.smtp_port,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.smtp_email, // generated ethereal user
            pass: process.env.smtp_password, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
}

module.exports = sendMail;
