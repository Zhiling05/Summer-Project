const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

// lsy新增：用公共的提取函数
const { extractSymptoms } = require('../utils/symptoms');

// /* ---------- 症状映射规则 ---------- */
// const SYMPTOM_RULES = {
//   /* 单选：Yes ⇒ Headache */
//   Q1: { Yes: 'Headache' },

//   /* 多选：保留原文，None of the above 忽略 */
//   Q2: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },
//   Q3: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },
//   Q4: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },

//   /* TVO / Double vision / Cranial nerve… */
//   Q5: { Yes: 'Transient visual obscurations (TVO)' },
//   Q6: { Yes: 'Binocular double vision' },
//   Q7: { Yes: 'Latent/manifest squint or uncorrected refractive error present' },
//   Q8: { Yes: 'Cranial nerve palsy pattern' },

//   /* Q9 – Q13 与上面同义 */
//   Q9 : { Yes: 'Transient visual obscurations (TVO)' },
//   Q10: { Yes: 'Binocular double vision' },
//   Q11: { Yes: 'Latent/manifest squint or uncorrected refractive error present' },
//   Q12: { Yes: 'Cranial nerve palsy pattern' },
//   Q13: { Yes: 'Other visual symptoms' },

//   /* 视盘、眼底体征 */
//   Q14: { Yes: 'Disc elevation' },
//   Q15: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },
//   Q16: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },

//   /* 视盘异常 / Drusen */
//   Q17: { Yes: 'Crowded/tilted discs or PHOMS (previously known)' },
//   Q18: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT (previously known)' },
//   Q19: { Yes: 'Crowded/tilted discs or PHOMS (at this visit)' },
//   Q20: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT (at this visit)' },

//   /* 视力 / 视野改变 */
//   Q21: { Yes: 'Change in visual acuity or fields' },
//   Q22: { Yes: 'Change in visual acuity or fields' },

//   Q23: { Yes: 'Disc elevation' },

  
//   Q24: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },
//   Q25: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },

//   /* crowded / drusen / 视力改变 逻辑重复出现 */
//   Q26: { Yes: 'Crowded/tilted discs or PHOMS (at/prev. visit)' },
//   Q27: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
//   Q28: { Yes: 'Change in visual acuity or fields' },

//   /* 再次出现的 disc-elevation + 眼底体征组合 */
//   Q29: { Yes: 'Disc elevation' },
//   Q30: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },
//   Q31: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },

//   /* 又一轮 crowded / drusen / 视力改变 */
//   Q32: { Yes: 'Crowded/tilted discs or PHOMS (at/prev. visit)' },
//   Q33: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
//   Q34: { Yes: 'Change in visual acuity or fields' },

//   /* NO_REFERRAL 分支前的最后一套重复题 */
//   Q35: { Yes: 'Disc elevation' },
//   Q36: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },
//   Q37: {
//     'None of the above': null,
//     '*': a => a.answer,
//   },
//   Q38: { Yes: 'Crowded/tilted discs or PHOMS (at/prev. visit)' },
//   Q39: { Yes: 'Having white-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
//   Q40: { Yes: 'Change in visual acuity or fields' },
// };

// /* 从 answers 中提取 symptoms */
// function extractSymptoms(answers = []) {
//   const out = [];
//   for (const a of answers) {
//     const rule = SYMPTOM_RULES[a.questionId];
//     if (!rule) continue;

//     if (Object.prototype.hasOwnProperty.call(rule, a.answer)) {
//       const v = rule[a.answer];
//       if (v == null) continue;
//       out.push(typeof v === 'function' ? v(a) : v);
//       continue;
//     }
//     if (rule['*'] && a.answer) {
//       const v = rule['*'];
//       out.push(typeof v === 'function' ? v(a) : v);
//     }
//   }
//   return [...new Set(out.filter(Boolean))]; // 去重 + 去空
// }

/**
 * GET /assessments  列表（可选 ?limit=50）
 * 返回精简字段，前端方便展示
 */
router.get('/assessments', async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(parseInt(req.query.limit || '50', 10), 200));
    const docs = await Assessment.find().sort({ createdAt: -1 }).limit(limit);

    const records = docs.map(d => ({
      id: d._id.toString(),
      role: d.role,
      patientId: d.patientId || '',
      recommendation: d.recommendation || '',
      createdAt: d.createdAt
    }));

    res.json(records);
  } catch (err) {
    console.error('[GET /assessments] error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /assessments/:id  单条详情
 * 返回 AssessmentDetail 需要的字段
 */
router.get('/assessments/:id', async (req, res) => {
  const { id } = req.params;

  if (id === 'LOCAL') {
    return res.status(400).json({ error: 'assessment.js: LOCAL is for preview only' });
  }

  try {
    const d = await Assessment.findById(id);
    if (!d) return res.status(404).json({ error: 'Assessment not found' });

    res.json({
      id: d._id.toString(),
      role: d.role,
      patientId: d.patientId || '',
      answers: d.answers || [],
      recommendation: d.recommendation || '',
      symptoms: (d.symptoms && d.symptoms.length) ? d.symptoms : extractSymptoms(d.answers || []),
      createdAt: d.createdAt
    });
  } catch (err) {
    console.error('[GET /assessments/:id] error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /assessments  新建
 * 前端期望返回 { id, createdAt }
 */
router.post('/assessments', async (req, res) => {
  try {
    const {
      role,
      patientId,
      content = '',
      recommendation,
      answers = []
    } = req.body || {};

    // 简单校验（可按需扩展）
    if (!role) return res.status(400).json({ error: 'role is required' });
    // 如果模型里 content 是 required，请保证非空；否则可在模型里把 content 改为 default: ''
    // if (!content) return res.status(400).json({ error: 'content is required' });

    //新增这一行
    const symptoms = extractSymptoms(answers);

    const newRecord = await Assessment.create({
      role,
      patientId,
      content,
      recommendation, // ← 需要模型里有该字段
      answers,          // ← 需要模型里有该字段
      symptoms,      // ← lsy新增
    });

    // 前端的 CreateAssessmentResponse 只用到 id / createdAt
    res.status(201).json({
      id: newRecord._id.toString(),
      createdAt: newRecord.createdAt
    });
  } catch (err) {
    console.error('[POST /assessments] error:', err);
    res.status(500).json({ error: err.message });
  }
});

// router.post('/assessments', async (req, res) => {
//   try {
//     const newRecord = await Assessment.create(req.body);
//     res.status(201).json(newRecord);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// router.extractSymptoms = extractSymptoms;
module.exports = router;