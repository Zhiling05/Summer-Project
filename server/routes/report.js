const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

router.get('/assessments/:id/report', async (req, res) => {
  try {
    const record = await Assessment.findById(req.params.id);
    if (!record) {
      console.warn('[report] ID not found:', req.params.id);
      return res.status(404).send('No report found');
    }

    const reportText = `
===== ASSESSMENT REPORT =====

Role       : ${record.role}
Patient ID : ${record.patientId || 'N/A'}
Content    : ${record.content}
Created At : ${new Date(record.createdAt).toLocaleString()}
`;

    res.type('text/plain').send(reportText);
  } catch (err) {
    console.error('[report error]', err);
    res.status(500).send('Report preview failed');
  }
});

module.exports = router;