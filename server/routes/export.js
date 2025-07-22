// routes/export.js
const express = require('express');
const { buildDoc } = require('../utils/doc');
const router = express.Router();

// 复用 assessments.js 里的 Map
const { assessments } = require('./assessments');  // ← 先在 assessments.js 导出它

router.get('/:id/export', async (req, res, next) => {
  try {
    const format = (req.query.format || 'txt').toLowerCase();
    const assessment = assessments.get(req.params.id);   // 直接从 Map 取
    if (!assessment) return res.status(404).send('Not found');

    const { path, cleanup, mime, ext } = await buildDoc(assessment, format);
    res.type(mime);
    res.download(path, `assessment-${assessment.id}.${ext}`, cleanup);
  } catch (e) { next(e); }
});

module.exports = router;
