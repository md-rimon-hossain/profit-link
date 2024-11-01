const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "jolnir.orangewebsite.com",
  port: 465, // or 465 if needed
  secure: true, // Use `true` for port 465, `false` for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

const sendVerificationEmail = async (emailData = {}) => {
  try {
    const mailOption = {
      from: process.env.EMAIL_USER, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html
    };
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log("Error is occurred from sendWithNodeMailer Function", error);
    throw error;
  }
};

module.exports = sendVerificationEmail;
