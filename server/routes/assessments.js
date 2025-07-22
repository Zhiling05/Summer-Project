// server/routes/assessments.js
const express = require('express');
const router  = express.Router();

/** 临时内存存储，后续可替换为真正的 DB(Model) */
const assessments = new Map();

/* ---------- POST /api/assessments ---------- */
router.post('/assessments', (req, res) => {
  const id        = Date.now().toString();   // 简单时间戳 ID
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

/* ---------- GET /api/assessments/:id/export ----------
 *  ⚠️ 运行时再 require utils/doc，避免与 report.js 循环引用
 * ---------------------------------------------- */
router.get('/assessments/:id/export', async (req, res, next) => {
  try {
    const ass = assessments.get(req.params.id);
    if (!ass) return res.status(404).send('Not found');

    // 按需加载，打破循环引用
    const { buildDoc } = require('../utils/doc');

    // 支持 ?format=txt，预留 docx 等
    const format = (req.query.format || 'txt').toLowerCase();
    const { path, cleanup, mime, ext } = await buildDoc(ass, format);

    res.type(mime).download(path, `assessment-${ass.id}.${ext}`, cleanup);
  } catch (e) { next(e); }
});

/* --------------- 导出 --------------- */
module.exports           = router;
module.exports.assessments = assessments;
