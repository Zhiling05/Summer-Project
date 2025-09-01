const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

const { extractSymptoms } = require('../utils/symptoms');
const { buildFullReportText } = require('../utils/doc');

/* 
 * GET /assessments/:id/report - Get assessment report text for preview
 * Returns plain text content for display, not download
 */
router.get('/assessments/:id/report', async (req, res) => {
  const { id } = req.params;
  
  /* Validate ID */
  if (id === 'LOCAL') {
    return res.status(400).json({ error: 'LOCAL is for preview only' });
  }
  
  try {
    /* Find assessment record */
    const record = await Assessment.findOne({ customId: id });
    if (!record) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    /* Ensure symptoms data is available */
    const symptoms = (record.symptoms && record.symptoms.length)
      ? record.symptoms
      : extractSymptoms(record.answers || []);

    /* Prepare report data with required fields only */
    const payload = {
      assessmentId: record.customId, 
      createdAt: record.createdAt,
      symptoms,
      recommendation: record.recommendation || '',
    };

    /* Generate report text */
    const text = buildFullReportText(payload);
    
    /* Set Content-Type for display, not download */
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(text);
  } catch (err) {
    console.error('[GET /assessments/:id/report] error:', err);
    res.status(500).json({ error: 'Report preview failed: ' + err.message });
  }
});

module.exports = router;