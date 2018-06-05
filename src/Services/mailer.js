const logger = require('./logger');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send mail to reset password with a link
 * @param {*} email 
 * @param {*} url 
 */
const sendResetMail = (email, url) => {
  const subject = 'Reset Password Ask';
  const html = `<p>This mail permits was sent to reset your password account for ${email}</p>
  
  <p>Just click on this link : ${url}</p>

  <p>If you never ask to reset your email, please contact us. Thanks</p>`;
  return sendMail({
    to: email,
    subject,
    html,
  })
    .then(message => Promise.resolve({
      error: null,
      data: { message: 'Password Reset mail sent !' },
      message,
    }))
    .catch(err => Promise.reject({
      err,
      email,
    }));
};

const sendMail = ({ to, from = process.env.MAILER_FROM, subject, html }) => {
  return new Promise((resolve, reject) => {
    const msg = {
      to,
      from,
      subject,
      html,
    };
    sgMail.send(msg)
      .then(() => {
        logger.info('Email send !', {
          to,
          from,
          subject,
          html,
          tags: ['success', 'sendMail', 'mailer'],
        })
        return resolve('Send Email !');
      })
      .catch((error) => {
        logger.error('Email not send !', {
          to,
          from,
          subject,
          html,
          error,
          tags: ['error', 'sendMail', 'mailer'],
        });
        return reject(error);
      });
  });
};

module.exports = { sendResetMail };
