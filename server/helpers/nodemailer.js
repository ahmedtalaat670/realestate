import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const randomOtpGenerator = () => crypto.randomInt(100000, 999999);

export const sendEmail = async (email, otp) => {
  await transporter
    .sendMail({
      from: {
        name: "Learning",
        address: process.env.NODEMAILER_USER,
      },
      to: email,
      subject: "otp verification",
      html: `<div>You verification code is <b>${otp}</b></div>`,
    })
    .catch((e) => console.log(e));
};
