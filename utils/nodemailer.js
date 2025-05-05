const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const sendEmail = async (emails, meetingLink, subject, text) => {
  try {
    for (let email of emails) {
      const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: emails.join(', '),
        subject: subject, 
        text: `${text}\n\n${meetingLink}`, 
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Invitation sent to: ${email}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending invitations');
  }
}

module.exports = { sendEmail };
