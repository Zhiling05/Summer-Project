const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const { buildFullReportText, buildDocFromText } = require('../utils/doc');
// const { sendAssessmentMail } = require('../utils/mailer');
const { sendAssessmentMail, verifySMTP } = require('../utils/mailer');
const { extractSymptoms } = require('../utils/symptoms');

/**
 * GET /send-report/ping - 检查邮件服务是否可用
 * 用于监控和调试
 */
router.get('/send-report/ping', (_req, res) => {
  // res.json({ ok: true, route: 'mail' });
  verifySMTP()
      .then(() => res.json({ ok: true }))
      .catch(e => res.status(500).json({ ok: false, error: e.message }));
});

/**
 * POST /send-report - 发送评估报告邮件
 * 接收assessmentId和目标邮箱，发送报告作为附件
 */
router.post('/send-report', async (req, res, next) => {
  try {
    const { assessmentId, emailTo, format = 'txt' } = req.body;
    
    // 参数验证
    if (!assessmentId) {
      return res.status(400).json({ error: 'assessmentId is required' });
    }
    if (!emailTo) {
      return res.status(400).json({ error: 'emailTo is required' });
    }
    if (format !== 'txt') {
      return res.status(400).json({ error: 'Only txt format is currently supported' });
    }

    // 查找评估记录
    const record = await Assessment.findOne({ customId: assessmentId });
    if (!record) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // 确保有症状数据
    const symptoms = (record.symptoms && record.symptoms.length)
      ? record.symptoms
      : extractSymptoms(record.answers || []);

    // 准备报告数据 - 只包含需要的字段
    const payload = {
      assessmentId: record.customId,
      createdAt: record.createdAt,
      symptoms,
      recommendation: record.recommendation || '',
    };

    // 生成报告文本并写入临时文件
    const text = buildFullReportText(payload);
    const { path, cleanup } = await buildDocFromText(text);

    // 设置邮件主题和文件名
    const date = new Date(record.createdAt).toLocaleDateString('en-GB');
    const subject = `Assessment Report - ${date}`;
    const filename = `assessment_report_${assessmentId}.txt`;

    // 发送邮件
    await sendAssessmentMail({
      to: emailTo,
      subject,
      text: 'Please find attached your assessment report.',
      attachmentPath: path,
      attachmentFilename: filename
    });

    // 清理临时文件并返回成功响应
    cleanup();
    res.json({ ok: true, message: 'Report sent successfully' });
  } catch (err) {
    console.error('[POST /send-report] error:', err);
    res.status(500).json({ error: 'Failed to send report: ' + err.message });
  }
});

module.exports = router;