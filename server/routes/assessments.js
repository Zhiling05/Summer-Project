const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

/**
 * GET /assessments  列表（可选 ?limit=50）
 * 返回精简字段，前端方便展示
 */
router.get('/assessments', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(parseInt(req.query.limit || '50', 10), 200));
    const docs = await Assessment.find().sort({ createdAt: -1 }).limit(limit);

    const records = docs.map(d => ({
      id: d._id.toString(),
      role: d.role,
      patientId: d.patientId || '',
      recommendation: d.recommendation || '',
      createdAt: d.createdAt
    }));

    res.json(records);
  } catch (err) {
    console.error('[GET /assessments] error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /assessments/:id  单条详情
 * 返回 AssessmentDetail 需要的字段
 */
router.get('/assessments/:id', async (req, res) => {
  const { id } = req.params;

  if (id === 'LOCAL') {
    return res.status(400).json({ error: 'assessment.js: LOCAL is for preview only' });
  }

  try {
    const d = await Assessment.findById(id);
    if (!d) return res.status(404).json({ error: 'Assessment not found' });

    res.json({
      id: d._id.toString(),
      role: d.role,
      patientId: d.patientId || '',
      answers: d.answers || [],               // 需要模型里有 answers 字段
      recommendation: d.recommendation || '', // 需要模型里有 recommendation 字段
      createdAt: d.createdAt
    });
  } catch (err) {
    console.error('[GET /assessments/:id] error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /assessments  新建
 * 前端期望返回 { id, createdAt }
 */
router.post('/assessments', async (req, res) => {
  try {
    const {
      role,
      patientId,
      content = '',
      recommendation,
      answers = []
    } = req.body || {};

    // 简单校验（可按需扩展）
    if (!role) return res.status(400).json({ error: 'role is required' });
    // 如果模型里 content 是 required，请保证非空；否则可在模型里把 content 改为 default: ''
    // if (!content) return res.status(400).json({ error: 'content is required' });

    const newRecord = await Assessment.create({
      role,
      patientId,
      content,
      recommendation, // ← 需要模型里有该字段
      answers         // ← 需要模型里有该字段
    });

    // 前端的 CreateAssessmentResponse 只用到 id / createdAt
    res.status(201).json({
      id: newRecord._id.toString(),
      createdAt: newRecord.createdAt
    });
  } catch (err) {
    console.error('[POST /assessments] error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/assessments', async (req, res) => {
  try {
    const newRecord = await Assessment.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;