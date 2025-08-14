// server/routes/export.js
const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

const { extractSymptoms }   = require('../utils/symptoms');
const { buildFullReportText } = require('../utils/doc');

router.get('/assessments/:id/export', async (req, res) => {
  const { id } = req.params;
  if (id === 'LOCAL') {
    return res.status(400).send('export.js: LOCAL is for preview only');
  }
  try {
    const record = await Assessment.findById(id);
    if (!record) return res.status(404).send('Not found');

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

    const filename = `report_${record._id}.txt`;
    const content  = buildFullReportText(payload);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.type('text/plain').send(content);
  } catch (err) {
    console.error('[export error]', err);
    res.status(500).send('Export failed');
  }
});

module.exports = router;
