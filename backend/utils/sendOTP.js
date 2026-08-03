import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Mini E-Commerce" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - OTP",

      html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
      
        <h2 style="color:#4CAF50;">Mini E-Commerce</h2>

        <p>Hello,</p>

        <p>Your One Time Password (OTP) is</p>

        <h1 style="
          letter-spacing:6px;
          color:#2196F3;
          text-align:center;
        ">
          ${otp}
        </h1>

        <p>This OTP will expire in <strong>10 minutes</strong>.</p>

        <p>If you didn't request this OTP, please ignore this email.</p>

        <br>

        <p>Thanks,</p>

        <p><strong>Mini E-Commerce Team</strong></p>

      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
};

export default sendOTP;
