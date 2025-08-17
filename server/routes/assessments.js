const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const { extractSymptoms } = require('../utils/symptoms');

/**
 * GET /assessments - 获取评估列表
 * 支持参数：
 * - limit: 限制返回数量，默认50
 * - riskLevel: 按风险级别筛选 (high/medium/low/all)
 * - startDate: 开始日期筛选
 * - endDate: 结束日期筛选
 */
router.get('/assessments', async (req, res) => {
   try {
    // const limit = Math.max(1, Math.min(parseInt(req.query.limit || '50', 10), 200));  不限制只有50个，否则会发生到了50后，新增的数据会把别的数据挤掉
    const query = {};
    
    // 风险级别筛选
    if (req.query.riskLevel && req.query.riskLevel !== 'all') {
      const riskLevel = req.query.riskLevel;
      // 将high/medium/low映射到实际的recommendation值
      if (riskLevel === 'high') {
        query.recommendation = { $in: ['EMERGENCY_DEPARTMENT', 'IMMEDIATE'] };
      } else if (riskLevel === 'medium') {
        query.recommendation = { $in: ['URGENT_TO_OPH', 'URGENT_TO_GP_OR_NEUR'] };
      } else if (riskLevel === 'low') {
        query.recommendation = { $in: ['TO_GP', 'NO_REFERRAL', 'OTHER_EYE_CONDITIONS_GUIDANCE'] };
      }
    }
    
    // 日期范围筛选
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        // 设置为当天结束时间
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }
    const docs = await Assessment.find(query).sort({ createdAt: -1 });
    const records = docs.map(d => ({
      id: d._id.toString(),
      risk: d.recommendation || 'no-referral',
      date: d.createdAt // 前端期望字段名为date
    }));

    res.json({ records });
  } catch (err) {
    console.error('[GET /assessments] error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /assessments/:id - 获取单个评估详情
 * 返回评估的完整信息
 */
router.get('/assessments/:id', async (req, res) => {
  const { id } = req.params;

  // 防止使用本地预览ID
  if (id === 'LOCAL') {
    return res.status(400).json({ error: 'LOCAL is for preview only' });
  }

  try {
    const assessment = await Assessment.findById(id);
    
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // 如果没有存储症状，则从答案中提取
    const symptoms = (assessment.symptoms && assessment.symptoms.length) 
      ? assessment.symptoms 
      : extractSymptoms(assessment.answers || []);

    // 返回AssessmentDetail格式
    res.json({
      id: assessment._id.toString(),
      role: assessment.role,
      answers: assessment.answers || [],
      symptoms: symptoms,
      recommendation: assessment.recommendation || '',
      createdAt: assessment.createdAt
    });
  } catch (err) {
    console.error('[GET /assessments/:id] error:', err);
    res.status(500).json({ error: err.message });
  }
})

/**
 * POST /assessments - 创建新评估
 * 接收评估数据并存储到数据库
 */
router.post('/assessments', async (req, res) => {
  try {
    const {
      role,
      answers = [],
      recommendation
    } = req.body || {};

    // 必填字段验证
    if (!role) {
      return res.status(400).json({ error: 'role is required' });
    }
    
    if (!recommendation) {
      return res.status(400).json({ error: 'recommendation is required' });
    }
    
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers array is required and cannot be empty' });
    }

    // 从答案中提取症状
    const symptoms = extractSymptoms(answers);

    // 创建新记录
    const newRecord = await Assessment.create({
      role,
      answers,
      recommendation,
      symptoms,
    });

    // 返回完整的AssessmentDetail
    res.status(201).json({
      id: newRecord._id.toString(),
      role: newRecord.role,
      answers: newRecord.answers,
      symptoms: newRecord.symptoms,
      recommendation: newRecord.recommendation,
      createdAt: newRecord.createdAt
    });
  } catch (err) {
    console.error('[POST /assessments] error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /extract-symptoms - 从答案中提取症状
 * 接收答案数组，返回提取的症状数组
 */
router.post('/extract-symptoms', async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'answers array is required' });
    }
    
    const symptoms = extractSymptoms(answers);
    res.json(symptoms);
  } catch (err) {
    console.error('[POST /extract-symptoms] error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /statistics/risk-levels - 获取风险级别统计
 * 返回各风险级别的记录数量
 */
router.get('/statistics/risk-levels', async (req, res) => {
  try {
    // 高风险统计
    const highRiskCount = await Assessment.countDocuments({
      recommendation: { $in: ['EMERGENCY_DEPARTMENT', 'IMMEDIATE'] }
    });
    
    // 中风险统计
    const mediumRiskCount = await Assessment.countDocuments({
      recommendation: { $in: ['URGENT_TO_OPH', 'URGENT_TO_GP_OR_NEUR'] }
    });
    
    // 低风险统计
    const lowRiskCount = await Assessment.countDocuments({
      recommendation: { $in: ['TO_GP', 'NO_REFERRAL', 'OTHER_EYE_CONDITIONS_GUIDANCE'] }
    });
    
    // 总数统计
    const totalCount = await Assessment.countDocuments();
    
    res.json({
      high: highRiskCount,
      medium: mediumRiskCount,
      low: lowRiskCount,
      total: totalCount
    });
  } catch (err) {
    console.error('[GET /statistics/risk-levels] error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;