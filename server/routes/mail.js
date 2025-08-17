// routes/mail.js
const express = require('express');
const router = express.Router();

// 看到这行说明文件被加载了
console.log('[routes/mail] loaded');

// 探针：判断路由是否挂上
router.get('/send-report/ping', (_req, res) => {
  res.json({ ok: true, route: 'mail' });
});

const Assessment = require('../models/Assessment');
const { buildFullReportText, buildDocFromText } = require('../utils/doc');
const { sendAssessmentMail } = require('../utils/mailer');
const { extractSymptoms } = require('../utils/symptoms'); // 复用同一套提取逻辑

router.post('/send-report', async (req, res, next) => {
  try {
    const { assessmentId, emailTo, format = 'txt' } = req.body;
    if (!assessmentId) return res.status(400).json({ error: 'assessmentId is required' });
    if (!emailTo)      return res.status(400).json({ error: 'emailTo is required' });
    if (format !== 'txt') return res.status(400).json({ error: 'only txt supported for now' });

    const record = await Assessment.findById(assessmentId);
    if (!record) return res.status(404).send('Not found');

    // —— 症状兜底：优先用持久化字段，否则从 answers 提取（和页面/导出一致）——
    const symptoms = (record.symptoms && record.symptoms.length)
      ? record.symptoms
      : extractSymptoms(record.answers || []);

    // —— 组装 Full Report 所需字段 —— 
    const payload = {
      id: record._id.toString(),
      createdAt: record.createdAt ? new Date(record.createdAt).toISOString() : '',
      role: record.role || '',
      symptoms,
      recommendation: record.recommendation || '',
    };

    // —— 拼 Full Report 文本，并写入临时 txt —— 
    const text = buildFullReportText(payload);
    const { path, cleanup } = await buildDocFromText(text);

    await sendAssessmentMail({
      to: emailTo,
      subject: `Assessment ${assessmentId}`,
      text: 'See attachment.',
      attachmentPath: path,
    });

    cleanup();
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;