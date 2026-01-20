import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail = async(to,otp) =>{
      await transporter.sendMail({
        from:process.env.EMAIL,
        to,
        subject:"Reset your QuickBite Password",
        html:`<p>Your OTP for QuickBite password reset ${otp}.</b> Expires in 5 minutes. </p>`
      })
}
