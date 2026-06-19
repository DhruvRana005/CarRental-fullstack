import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, text, html }) => {
  try {
    let transportConfig;
    if (process.env.SMTP_HOST && process.env.SMTP_HOST.includes("gmail")) {
      transportConfig = {
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
    } else {
      transportConfig = {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      };
    }

    const transporter = nodemailer.createTransport(transportConfig);

    const mailOptions = {
      from: `"4WHEELER Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error("Send Email Error:", error);
    return { success: false, error };
  }
};

export default sendEmail;
