const nodemailer = require("nodemailer");
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
    body { margin: 0; padding: 0; font-family: Arial; background: #f5f5f5; }
    .doctor-name { font-size: 24px; color: #d55d5d; font-weight: bold; text-align: center; margin-top: 100px; }
    .wrapper { background: #fff; padding: 40px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2 class="doctor-name">Welcome, Dr. ${doctorName}</h2>
    <p style="text-align:center;">Thank you for joining us!</p>
    <p style="text-align:center;"><a href="https://alkem-mob.vercel.app">Go to Home Page</a></p>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
    to: toEmail,
    subject: `Welcome Dr. ${doctorName}`,
    html: htmlContent,
  });
};

module.exports = sendInviteEmail;
