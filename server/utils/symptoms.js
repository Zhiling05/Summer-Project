// server/utils/symptoms.js


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

/* ---------- 从 answers 中提取症状 ---------- */
function extractSymptoms(answers = []) {
  const out = [];
  for (const a of answers) {
    const rule = SYMPTOM_RULES[a.questionId];
    if (!rule) continue;

    if (Object.prototype.hasOwnProperty.call(rule, a.answer)) {
      const v = rule[a.answer];
      if (v == null) continue;
      out.push(typeof v === 'function' ? v(a) : v);
      continue;
    }
    if (rule['*'] && a.answer) {
      const v = rule['*'];
      out.push(typeof v === 'function' ? v(a) : v);
    }
  }
  return [...new Set(out.filter(Boolean))]; // 去空 + 去重
}

module.exports = { SYMPTOM_RULES, extractSymptoms };