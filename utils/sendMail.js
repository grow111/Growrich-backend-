const nodemailer = require('nodemailer');

const sendMail = async (subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"GrowRich" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // Admin receives it
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
  } catch (err) {
    console.error('Failed to send email:', err.message);
  }
};

module.exports = sendMail;
