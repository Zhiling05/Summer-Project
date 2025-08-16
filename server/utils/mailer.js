const nodemailer = require('nodemailer');
const path = require('path');

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
async function sendAssessmentMail({ 
  to, 
  subject, 
  text, 
  attachmentPath,
  attachmentFilename
}) {
  const filename = attachmentFilename || path.basename(attachmentPath);
  
  return transporter.sendMail({
    from: '"Papilloedema Assessment" <no-reply@dipp.local>',
    to,
    subject,
    text,
    attachments: [{ 
      filename,
      path: attachmentPath 
    }],
  });
}

module.exports = { sendAssessmentMail };
