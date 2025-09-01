const express = require('express');
const router = express.Router();
const {format} = require('date-fns');
const Assessment = require('../models/Assessment');
const { extractSymptoms } = require('../utils/symptoms');

/* Generate custom ID in format: ddMMyyyy_001 */
async function generateCustomId() {
  const today = format(new Date(), 'ddMMyyyy');
  const lastRecord = await Assessment.findOne({
    customId: { $regex: `^${today}_` }
  }).sort({ customId: -1 });

  let sequence = 1;
  if (lastRecord) {
    const lastSequence = parseInt(lastRecord.customId.split('_')[1]);
    sequence = lastSequence + 1;
  }

  return `${today}_${sequence.toString().padStart(3, '0')}`;
}

/* 
 * GET /assessments - Get list of assessments with filtering
 * Query params: riskLevel (high/medium/low/all), startDate, endDate, scope (own/all)
 */
router.get('/assessments', async (req, res) => {
   try {
     const isAdmin = req.user?.role === 'admin';
     const owner = (isAdmin && req.query.scope === 'all') ? {} : { userId: req.user.id };

    const query = {};
    
    /* Risk level filtering */
    if (req.query.riskLevel && req.query.riskLevel !== 'all') {
      const riskLevel = req.query.riskLevel;
      if (riskLevel === 'high') {
        query.recommendation = { $in: ['EMERGENCY_DEPARTMENT', 'IMMEDIATE'] };
      } else if (riskLevel === 'medium') {
        query.recommendation = { $in: ['URGENT_TO_OPH', 'URGENT_TO_GP_OR_NEUR'] };
      } else if (riskLevel === 'low') {
        query.recommendation = { $in: ['TO_GP', 'NO_REFERRAL', 'OTHER_EYE_CONDITIONS_GUIDANCE'] };
      }
    }
    
    /* Date range filtering */
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      
      if (req.query.endDate) {
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    const docs = await Assessment.find({ ...query, ...owner }).sort({ createdAt: -1 });

    const records = docs.map(d => ({
      id: d.customId || d._id.toString(),
      risk: d.recommendation || 'no-referral',
      date: d.createdAt
    }));

    res.json({ records });
  } catch (err) {
    console.error('[GET /assessments] error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* 
 * GET /assessments/:id - Get single assessment details
 * Returns complete assessment information
 */
router.get('/assessments/:id', async (req, res) => {
  const { id } = req.params;

  if (id === 'LOCAL') {
    return res.status(400).json({ error: 'LOCAL is for preview only' });
  }

  try {
    const isAdmin = req.user?.role === 'admin';
    if (req.query.scope === 'all' && !isAdmin) {
      return res.status(403).json({error: 'forbidden'});
    }
    const filter = (isAdmin && req.query.scope === 'all') ? { customId: id } : { customId: id, userId: req.user.id };
    const assessment = await Assessment.findOne(filter);

    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    /* Extract symptoms if not stored */
    const symptoms = (assessment.symptoms && assessment.symptoms.length) 
      ? assessment.symptoms 
      : extractSymptoms(assessment.answers || []);

    res.json({
      id: assessment.customId,
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

/* 
 * POST /assessments - Create new assessment
 * Body: role, answers[], recommendation
 */
router.post('/assessments', async (req, res) => {
  try {
    const {
      role,
      answers = [],
      recommendation
    } = req.body || {};

    /* Validate required fields */
    if (!role) {
      return res.status(400).json({ error: 'role is required' });
    }
    
    if (!recommendation) {
      return res.status(400).json({ error: 'recommendation is required' });
    }
    
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers array is required and cannot be empty' });
    }

    /* Extract symptoms from answers and generate custom ID */
    const symptoms = extractSymptoms(answers);
    const customId = await generateCustomId();

    const newRecord = await Assessment.create({
      customId,
      userId: req.user.id,
      role,
      answers,
      recommendation,
      symptoms,
    });

    res.status(201).json({
      id: newRecord.customId,
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

/* 
 * POST /extract-symptoms - Extract symptoms from answers array
 * Body: answers[]
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

/* 
 * GET /statistics/risk-levels - Get risk level statistics
 * Returns count for high/medium/low risk assessments
 */
router.get('/statistics/risk-levels', async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    if (req.query.scope === 'all' && !isAdmin) {
      return res.status(403).json({error: 'forbidden'});
    }
    const base = (isAdmin && req.query.scope === 'all') ? {} : { userId: req.user.id };

    /* Count assessments by risk level */
    const highRiskCount = await Assessment.countDocuments({
      ...base,
      recommendation: { $in: ['EMERGENCY_DEPARTMENT', 'IMMEDIATE'] }
    });
    
    const mediumRiskCount = await Assessment.countDocuments({
      ...base,
      recommendation: { $in: ['URGENT_TO_OPH', 'URGENT_TO_GP_OR_NEUR'] }
    });
    
    const lowRiskCount = await Assessment.countDocuments({
      ...base,
      recommendation: { $in: ['TO_GP', 'NO_REFERRAL', 'OTHER_EYE_CONDITIONS_GUIDANCE'] }
    });
    
    const totalCount = await Assessment.countDocuments(base);

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