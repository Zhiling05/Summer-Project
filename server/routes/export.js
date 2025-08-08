const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

router.get('/assessments/:id/export', async (req, res) => {
  const { id } = req.params; // 新增解构
  console.log('[export.js] id =', id); // 新增打印
  if (id === 'LOCAL') {
    return res.status(400).json({ error: "report.js :LOCAL is for preview only" });
  }
  try {
    const record = await Assessment.findById(req.params.id);
    if (!record) return res.status(404).send('Not found');

    const filename = `report_${record._id}.txt`;
    const content = `
===== ASSESSMENT EXPORT =====

Role       : ${record.role}
Patient ID : ${record.patientId || 'N/A'}
Content    : ${record.content}
Created At : ${new Date(record.createdAt).toLocaleString()}
`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.type('text/plain').send(content);
  } catch (err) {
    console.error('[export error]', err);
    res.status(500).send('Export failed');
  }
});

module.exports = router;