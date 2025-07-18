const nodemailer = require("nodemailer");

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: `"CircleVerse" <${process.env.EMAIL_USERNAME}>`, 
        to: options.email,
        subject: options.subject,
        html: options.html,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
