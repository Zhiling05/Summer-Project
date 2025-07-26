// server/routes/assessments.js
const express = require('express');
const router  = express.Router();

/** 临时内存存储，后续可替换为真正的 DB(Model) */
const assessments = new Map();

/* ===== 在文件顶部，现有 const assessments … 下面追加 ===== */
const RECOMMEND_TO_RISK = {                       // 映射一次即可
  EmergencyDepartment:        'emergency-department',
  Immediate:                  'immediate',
  UrgentToOph:                'urgent-to-oph',
  UrgentToGpOrNeur:           'urgent-to-gp-or-neur',
  ToGP:                       'to-gp',
  NoReferral:                 'no-referral',
};

/* ---------- POST /api/assessments ---------- */
router.post('/assessments', (req, res) => {
  const id        = Date.now().toString();   // 简单时间戳 ID
  const createdAt = new Date().toISOString();

 
    /* 统一 recommendation 串：小写 + "_"→"-" */
  const normKey = (req.body.recommendation || 'no_referral')
                    .toLowerCase()          // emergency_department
                    .replace(/_/g, '-');    // emergency-department

  /* 映射到 risk；未命中则降级为 no-referral */
  const risk = {
    'emergency-department':   'emergency-department',
    'immediate':              'immediate',
    'urgent-to-oph':          'urgent-to-oph',
    'urgent-to-gp-or-neur':   'urgent-to-gp-or-neur',
    'to-gp':                  'to-gp',
    'no-referral':            'no-referral',
  }[normKey] || 'no-referral';

  assessments.set(id, { id, createdAt, risk, ...req.body });
  console.log('[POST /assessments] saved', { id, risk });

  res.json({ id, createdAt });
});

/* ---------- GET /api/assessments/:id ---------- */
router.get('/assessments/:id', (req, res) => {
  const record = assessments.get(req.params.id);
  if (!record) return res.status(404).json({ error: 'Not found' });
  res.json(record);
});

router.get('/assessments', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;

  const rows = Array.from(assessments.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map(r => ({
      id:   r.id,
      date: r.createdAt,
      risk: r.risk || 'no-referral',
    }));

  res.json({ records: rows });
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
