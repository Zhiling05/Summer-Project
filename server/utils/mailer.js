// utils/mailer.js
console.log('[mailer] loaded');  // 启动后端时就会看到这行日志

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** 发送带附件的邮件 */
async function sendAssessmentMail({ to, subject, text, attachmentPath }) {
  return transporter.sendMail({
    from: '"DIPP App" <no-reply@dipp.local>',
    to,
    subject,
    text,
    attachments: [{ filename: attachmentPath.split('/').pop(), path: attachmentPath }],
  });
}

module.exports = { sendAssessmentMail };  // ★仅此一行导出
