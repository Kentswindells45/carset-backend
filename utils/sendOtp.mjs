import nodemailer from "nodemailer";

const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"CarSet" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your CarSet OTP Code",
      html: `
        <div style="font-family: sans-serif;">
          <h2>CarSet Verification Code</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This code will expire in a few minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send OTP:", error.message);
    throw new Error("Failed to send OTP");
  }
};

export default sendOTP;
