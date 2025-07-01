const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const sendInviteEmail = async (toEmail, doctorName = "Doctor") => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Alkem</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          text-align: center;
        }
        .doctor-name {
          font-size: 22px;
          color: #d55d5d;
          font-weight: bold;
          margin-top: 20px;
        }
        img {
          max-width: 100%;
          height: auto;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <p class="doctor-name">Dear Dr. ${doctorName},</p>
      <p>Thank you for joining hands with Alkem.</p>
      <img src="cid:template_image" alt="Thank you image" />
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
    to: toEmail,
    subject: "Alkem Altron Doctor's Day - Thank You!",
    html: htmlContent,
    attachments: [
      {
        filename: "template.png",
        path: path.join(__dirname, "../assets/template.png"),
        cid: "template_image", // <-- same as used in img src
      },
    ],
  });
};

module.exports = sendInviteEmail;
