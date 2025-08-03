const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

/** 临时内存存储，后续可替换为真正的 DB(Model) */
const assessments = new Map();

/* ---------- 症状映射规则 ---------- */
const SYMPTOM_RULES = {
  /* 单选：Yes ⇒ Headache */
  Q1: { Yes: 'Headache' },

  /* 多选：保留原文，None of the above 忽略 */
  Q2: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q3: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q4: {
    'None of the above': null,
    '*': a => a.answer,
  },

  /* TVO / Double vision / Cranial nerve… */
  Q5: { Yes: 'Transient visual obscurations (TVO)' },
  Q6: { Yes: 'Binocular double vision' },
  Q7: { Yes: 'Latent/manifest squint or uncorrected refractive error present' },
  Q8: { Yes: 'Cranial nerve palsy pattern' },

  /* Q9 – Q13 与上面同义 */
  Q9 : { Yes: 'Transient visual obscurations (TVO)' },
  Q10: { Yes: 'Binocular double vision' },
  Q11: { Yes: 'Latent/manifest squint or uncorrected refractive error present' },
  Q12: { Yes: 'Cranial nerve palsy pattern' },
  Q13: { Yes: 'Other visual symptoms' },

  /* 视盘、眼底体征 */
  Q14: { Yes: 'Disc elevation' },
  Q15: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q16: {
    'None of the above': null,
    '*': a => a.answer,
  },

  /* 视盘异常 / Drusen */
  Q17: { Yes: 'Crowded/tilted discs or PHOMS (previously known)' },
  Q18: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT (previously known)' },
  Q19: { Yes: 'Crowded/tilted discs or PHOMS (at this visit)' },
  Q20: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT (at this visit)' },

  /* 视力 / 视野改变 */
  Q21: { Yes: 'Change in visual acuity or fields' },
  Q22: { Yes: 'Change in visual acuity or fields' },

  Q23: { Yes: 'Disc elevation' },

  
  Q24: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q25: {
    'None of the above': null,
    '*': a => a.answer,
  },

  /* crowded / drusen / 视力改变 逻辑重复出现 */
  Q26: { Yes: 'Crowded/tilted discs or PHOMS (at/prev. visit)' },
  Q27: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
  Q28: { Yes: 'Change in visual acuity or fields' },

  /* 再次出现的 disc-elevation + 眼底体征组合 */
  Q29: { Yes: 'Disc elevation' },
  Q30: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q31: {
    'None of the above': null,
    '*': a => a.answer,
  },

  /* 又一轮 crowded / drusen / 视力改变 */
  Q32: { Yes: 'Crowded/tilted discs or PHOMS (at/prev. visit)' },
  Q33: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
  Q34: { Yes: 'Change in visual acuity or fields' },

  /* NO_REFERRAL 分支前的最后一套重复题 */
  Q35: { Yes: 'Disc elevation' },
  Q36: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q37: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q38: { Yes: 'Crowded/tilted discs or PHOMS (at/prev. visit)' },
  Q39: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
  Q40: { Yes: 'Change in visual acuity or fields' },
};

router.post('/assessments', (req, res) => {
  const id        = Date.now().toString();
  const createdAt = new Date().toISOString();

  /* --- Recommendation → risk 逻辑（保持原样） --- */
  const normKey = (req.body.recommendation || 'no_referral')
                    .toLowerCase()
                    .replace(/_/g, '-');

  const risk = {
    'emergency-department':   'emergency-department',
    'immediate':              'immediate',
    'urgent-to-oph':          'urgent-to-oph',
    'urgent-to-gp-or-neur':   'urgent-to-gp-or-neur',
    'to-gp':                  'to-gp',
    'no-referral':            'no-referral',
  }[normKey] || 'no-referral';

  /* --- 症状提取 --- */
  const symptoms = req.body.answers.flatMap(a => {
    const rule = SYMPTOM_RULES[a.questionId];
    if (!rule) return [];

/* ---------- 1. 精确匹配 ---------- */
    if (Object.prototype.hasOwnProperty.call(rule, a.answer)) {
      const v = rule[a.answer];      // 可能是 字符串 / 函数 / null
      if (v == null) return [];      // 显式 null ⇒ 忽略
      return typeof v === 'function' ? [v(a)] : [v];
    }

    /* ---------- 2. 通配符 '*' ---------- */
    if (rule['*']) {
      if (!a.answer) return [];
      const v = rule['*'];
      return typeof v === 'function' ? [v(a)] : [v];
    }
    return [];
  });

  /* --- 写入 Map --- */
  assessments.set(id, { id, createdAt, risk, symptoms, ...req.body });
  console.log('[POST /assessments] saved', { id, risk, symptoms });

  res.json({ id, createdAt });
});

// 获取所有记录
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
    const a = await Assessment.findById(req.params.id);
    res.json(a);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router;
