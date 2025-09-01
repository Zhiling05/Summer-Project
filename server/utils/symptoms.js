const SYMPTOM_RULES = {
  Q1: { Yes: 'Headache' },
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

  Q5: { Yes: 'New-onset Transient visual obscurations (TVO)' },
  Q6: { Yes: 'Binocular double vision' },
  Q7: { Yes: 'Latent/manifest squint or uncorrected refractive error present' },
  Q8: { Yes: 'Cranial nerve palsy pattern' },

  Q9 : { Yes: 'New-onset Transient visual obscurations (TVO)' },
  Q10: { Yes: 'Binocular double vision' },
  Q11: { Yes: 'Latent/manifest squint or uncorrected refractive error present' },
  Q12: { Yes: 'Cranial nerve palsy pattern' },
  Q13: { Yes: 'Other visual symptoms unrelated to papilledema' },

  Q14: { Yes: 'Disc elevation' },
  Q15: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q16: {
    'None of the above': null,
    '*': a => a.answer,
  },

  Q17: { Yes: 'Crowded/tilted discs or PHOMS on OCT imaging (previously known)' },
  Q18: { Yes: 'White-yellow bodies within the optic disc or signs compatible with drusen on OCT (previously known)' },
  Q19: { Yes: 'Crowded/tilted discs or PHOMS on OCT imaging (discovered at this visit)' },
  Q20: { Yes: 'White-yellow bodies within the optic disc or signs compatible with drusen on OCT (discovered at this visit)' },

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
  Q26: { Yes: 'Crowded/tilted discs or PHOMS on OCT imaging (discovered at this visit or previously known)' },
  Q27: { Yes: 'White-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
  Q28: { Yes: 'Change in visual acuity or fields' },
  Q29: { Yes: 'Disc elevation' },
  Q30: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q31: {
    'None of the above': null,
    '*': a => a.answer,
  },


  Q32: { Yes: 'Crowded/tilted discs or PHOMS on OCT imaging (discovered at this visit or previously known)' },
  Q33: { Yes: 'White-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
  Q34: { Yes: 'Change in visual acuity or fields' },


  Q35: { Yes: 'Disc elevation' },
  Q36: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q37: {
    'None of the above': null,
    '*': a => a.answer,
  },
  Q38: { Yes: 'Crowded/tilted discs or PHOMS on OCT imaging (discovered at this visit or previously known)' },
  Q39: { Yes: 'White-yellow bodies within the optic disc or signs compatible with drusen on OCT' },
  Q40: { Yes: 'Change in visual acuity or fields' },
};

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
  return [...new Set(out.filter(Boolean))]; 
}

module.exports = { SYMPTOM_RULES, extractSymptoms };