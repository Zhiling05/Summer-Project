// server/routes/assessments.js
const express = require('express');
const router  = express.Router();

/** 临时内存存储，后续可替换为真正的 DB(Model) */
const assessments = new Map();

/* ---------- POST /api/assessments ---------- */
router.post('/assessments', (req, res) => {
  const id = Date.now().toString();        // 简单时间戳 ID
  const createdAt = new Date().toISOString();

  assessments.set(id, { id, createdAt, ...req.body });
  console.log('Received assessment:', req.body);

  res.json({ id, createdAt });
});

/* ---------- GET /api/assessments/:id ---------- */
router.get('/assessments/:id', (req, res) => {
  const record = assessments.get(req.params.id);
  if (!record) return res.status(404).json({ error: 'Not found' });
  res.json(record);
});

/* ---------- GET /api/assessments/:id/export ---------- */
router.get('/assessments/:id/export', (req, res) => {
  const record = assessments.get(req.params.id);
  if (!record) return res.status(404).send('Not found');

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=assessment-${record.id}.txt`
  );
  res.type('txt').send(
    `ID: ${record.id}\n` +
    `Role: ${record.role}\n` +
    `Recommendation: ${record.recommendation}\n` +
    `Answers:\n${JSON.stringify(record.answers, null, 2)}\n`
  );
});

module.exports = router;
module.exports.assessments = assessments;