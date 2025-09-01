const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

const { extractSymptoms } = require('../utils/symptoms');
const { buildFullReportText } = require('../utils/doc');

/* 
 * GET /assessments/:id/export - Export assessment report as downloadable file
 * Query params: format (default: 'txt')
 */
router.get('/assessments/:id/export', async (req, res) => {
  const { id } = req.params;
  const format = req.query.format || 'txt';
  
  if (id === 'LOCAL') {
    return res.status(400).json({ error: 'LOCAL is for preview only' });
  }
  
  /* Validate format - currently only txt is supported */
  if (format !== 'txt') {
    return res.status(400).json({ error: 'Only txt format is currently supported' });
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

    /* Prepare report data */
    const payload = {
      assessmentId: record.customId,
      createdAt: record.createdAt,
      symptoms,
      recommendation: record.recommendation || '',
    };

    /* Generate report content and filename */
    const filename = `assessment_report_${record.customId}.txt`;
    const content = buildFullReportText(payload);

    /* Set download headers and send file */
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(content);
  } catch (err) {
    console.error('[GET /assessments/:id/export] error:', err);
    res.status(500).json({ error: 'Export failed: ' + err.message });
  }
});

module.exports = router;