import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async (email, otp) => {
  await resend.emails.send({
    from: "Mini Ecommerce <onboarding@resend.dev>",
    to: email,
    subject: "OTP Verification",
    html: `<h1>${otp}</h1>`,
  });
};

export default sendEmail;
