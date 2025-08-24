const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

const { extractSymptoms }   = require('../utils/symptoms');
const { buildFullReportText } = require('../utils/doc');

/**
 * GET /assessments/:id/report - 获取评估报告文本
 * 返回评估报告的纯文本内容，用于预览而非下载
 */
router.get('/assessments/:id/report', async (req, res) => {
  const { id } = req.params;
  
  // 验证ID
  if (id === 'LOCAL') {
    return res.status(400).json({ error: 'LOCAL is for preview only' }); //使用json格式的错误相应
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

    // 准备报告数据 - 只包含需要的字段
    const payload = {
      assessmentId: record.customId, 
      createdAt: record.createdAt,
      symptoms,
      recommendation: record.recommendation || '',
    };

    // 生成报告文本
    const text = buildFullReportText(payload);
    
    // 设置Content-Type但不设置Content-Disposition，使内容显示而非下载
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(text);
  } catch (err) {
    console.error('[GET /assessments/:id/report] error:', err);
    res.status(500).json({ error: 'Report preview failed: ' + err.message });
  }
});

module.exports = router;
