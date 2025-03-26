// utils/mailer.js
const transporter = require("../config/nodemailer");

/**
 * Sends an email using nodemailer transporter.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Subject line.
 * @param {string} options.text - Plain text body.
 * @param {string} [options.html] - Optional HTML body.
 */
async function sendMail(options) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"No Reply" <noreply@example.com>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

module.exports = { sendMail };
