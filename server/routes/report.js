// server/routes/report.js
const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

const { extractSymptoms }   = require('../utils/symptoms');
const { buildFullReportText } = require('../utils/doc');

router.get('/assessments/:id/report', async (req, res) => {
  const { id } = req.params;
  if (id === 'LOCAL') {
    return res.status(400).send('report.js: LOCAL is for preview only');
  }
  try {
    const record = await Assessment.findById(id);
    if (!record) return res.status(404).send('No report found');

    const symptoms = (record.symptoms && record.symptoms.length)
      ? record.symptoms
      : extractSymptoms(record.answers || []);  // 兜底

    const payload = {
      id: record._id.toString(),
      createdAt: record.createdAt ? new Date(record.createdAt).toISOString() : '',
      role: record.role || '',
      symptoms,
      recommendation: record.recommendation || '',
    };

    const text = buildFullReportText(payload);
    res.type('text/plain').send(text);
  } catch (err) {
    console.error('[report error]', err);
    res.status(500).send('Report preview failed');
  }
});

module.exports = router;
