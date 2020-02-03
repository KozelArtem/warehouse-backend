const mailer = require('nodemailer');

const config = {
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};

const transporter = mailer.createTransport(config);

const sendMail = async (to, subject, body, attachments) => {
  try {
    await transporter.sendMail({
      from: `"MPP | Отчет" ${config.auth.user}`,
      to,
      bcc:  process.env.MAIL_BCC,
      subject,
      text: body,
      attachments,
    });

    console.log('message sent');
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  sendMail,
};
