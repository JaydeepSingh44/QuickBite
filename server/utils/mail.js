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

export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Delivery OTP",
      html: `<p>Your OTP for delivery is 
      <b>${otp}</b>. It expires in 5 minutes.</p>`
    });
  } catch (error) {
    console.log("Send Delivery OTP Mail Error:", error);
  }
};