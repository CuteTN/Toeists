// import nodemailer from "nodemailer";
// import { Users } from "../models/user.js";
// import jwt from "jsonwebtoken";
// const JWT_KEY = "TOEISTS_TEST";

// export const sendVerificationMail = async (email) => {
//   const user = await Users.findOne({ email: email });
//   const token = jwt.sign({ email: email, id: user._id }, JWT_KEY, {
//     expiresIn: "30m",
//   });
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "toeists.app@gmail.com",
//       pass: "toeists123",
//     },
//   });
//   const mailContent = `
//   <h1>Hi, ${user.name}!</h1>
//   <h4>To complete the process, please verify your email address by simply clicking the link below or pasting it into your browser:</h4>
//   <p>${process.env.FRONTEND_URL}/activate/${token}</p>
//   <p>The above activation link expires in 30 minutes.</p>
//   <h3>Team</p>
//   `;

//   const mailOptions = {
//     from: "toeists.app@gmail.com",
//     to: email,
//     subject: "Verify Your Email Address",
//     generateTextFromHTML: true,
//     html: mailContent,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.error(error);
//     } else {
//       console.info("Email sent: " + info.response);
//     }
//   });
// };

// export default sendVerificationMail;
