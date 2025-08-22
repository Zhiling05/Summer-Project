const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

const { extractSymptoms } = require('../utils/symptoms');
const { buildFullReportText } = require('../utils/doc');

/**
 * GET /assessments/:id/export - 导出评估报告为文件
 * 将评估报告生成为可下载的txt文件
 */
router.get('/assessments/:id/export', async (req, res) => {
  const { id } = req.params;
  const format = req.query.format || 'txt';
  
  if (id === 'LOCAL') {
    return res.status(400).json({ error: 'LOCAL is for preview only' });
  }
  
  // 验证格式（目前只支持txt）
  if (format !== 'txt') {
    return res.status(400).json({ error: 'Only txt format is currently supported' });
  }
  
  try {
    // 查找评估记录
    const record = await Assessment.findOne({ customId: id });
    if (!record) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // 确保有症状数据
    const symptoms = (record.symptoms && record.symptoms.length)
      ? record.symptoms
      : extractSymptoms(record.answers || []);

    // 准备报告数据
    const payload = {
      assessmentId: record.customId,
      createdAt: record.createdAt,
      symptoms,
      recommendation: record.recommendation || '',
    };

    // 生成报告文本
    const filename = `assessment_report_${record.customId}.txt`;
    const content = buildFullReportText(payload);

    // 设置下载响应头
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    // 发送文件内容
    res.send(content);
  } catch (err) {
    console.error('[GET /assessments/:id/export] error:', err);
    res.status(500).json({ error: 'Export failed: ' + err.message });
  }
});

module.exports = router;