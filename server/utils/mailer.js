const nodemailer = require('nodemailer');
const path = require('path');

const PORT = Number(process.env.SMTP_PORT || 465);
const SECURE = PORT === 465; // 465=SMTPS

/**
 * 发送带附件的评估报告邮件
 * @param {Object} options - 邮件选项
 * @param {string} options.to - 收件人邮箱
 * @param {string} options.subject - 邮件主题
 * @param {string} options.text - 邮件正文
 * @param {string} options.attachmentPath - 附件文件路径
 * @param {string} [options.attachmentFilename] - 自定义附件文件名（可选）
 * @returns {Promise<Object>} 发送结果
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: PORT,
  secure: SECURE,                 // 465 用 true；587 用 false
  auth: {
    user: process.env.SMTP_USER,  // 必须等于发件人
    pass: process.env.SMTP_PASS   // Gmail 应用专用密码
  },
  ...(SECURE ? {} : { requireTLS: true }) // 587 需要 STARTTLS
});

async function verifySMTP() { return transporter.verify(); }

async function sendAssessmentMail({ to, subject, text, html, attachmentPath, attachmentFilename }) {
  const attachments = attachmentPath ? [{ filename: attachmentFilename || path.basename(attachmentPath), path: attachmentPath }] : undefined;
  return transporter.sendMail({
    from: `"Papilloedema Assessment" <${process.env.SMTP_USER}>`, // 发件人与登录邮箱一致
    to, subject, text, html, attachments
  });
}

module.exports = { verifySMTP, sendAssessmentMail };