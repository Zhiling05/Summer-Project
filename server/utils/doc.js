// server/utils/doc.js
const fs  = require('fs-extra');
const tmp = require('tmp-promise');

/* ---------- 推荐代码 → 可读文本 ---------- */
const RECOMMEND_TEXT = {
  EMERGENCY_DEPARTMENT: 'Send patient to Emergency Department immediately',
  IMMEDIATE           : 'Immediate referral to Eye Emergency On-Call',
  URGENT_TO_OPH       : 'Urgent referral to Ophthalmology',
  URGENT_TO_GP_OR_NEUR: 'Urgent referral to GP or Neurology',
  TO_GP               : 'Refer to General Practitioner',
  NO_REFERRAL         : 'No referral required',
  OTHER_EYE_CONDITIONS_GUIDANCE: 'Referral to other department',
};

/* ---------- Full Report 风格文本（和页面一致） ---------- */
function buildFullReportText(ass) {
  const iso = ass.createdAt
    ? new Date(ass.createdAt).toISOString()
    : '';

  const symptoms = (ass.symptoms && ass.symptoms.length)
    ? ass.symptoms.map(s => `- ${s}`).join('\n')
    : 'No symptom recorded.';

  const rec = RECOMMEND_TEXT[ass.recommendation] || ass.recommendation || '';

  return [
    'Full Report',
    '',
    'Basic information',
    '',
    `ID: ${ass.id || ''}`,
    `Date: ${iso}`,
    `Role: ${ass.role || ''}`,
    '',
    'Patient symptoms',
    '',
    symptoms,
    '',
    'Recommendation',
    '',
    rec,
    '',
  ].join('\n');
}

/* ---------- 旧版详细问答文本（保留以免别处使用） ---------- */
function buildText(ass) {
  const lines = [
    `Assessment ${ass.id}`,
    `Date      : ${ass.createdAt}`,
    `Role      : ${ass.role}`,
    '----------------------------------------',
    ...(ass.answers || []).map(
      a =>
        `${a.questionId}: ${a.question || '(question text missing)'}\n` +
        `Answer    : ${a.answer}\n`
    ),
    ...(ass.symptoms?.length
      ? [
          '----------------------------------------',
          'Symptoms:',
          ...ass.symptoms.map(s => `- ${s}`),
        ]
      : []),
    '----------------------------------------',
    `Recommendation: ${RECOMMEND_TEXT[ass.recommendation] || ass.recommendation}`,
    '',
  ];
  return lines.join('\n');
}

/* ---------- 写详细问答版到临时 txt 文件 ---------- */
async function buildDoc(ass, format = 'txt') {
  if (format !== 'txt') {
    const err  = new Error('only txt supported');
    err.status = 501;
    throw err;
  }
  const { path, cleanup } = await tmp.file({ postfix: '.txt' });
  await fs.writeFile(path, buildText(ass), 'utf8'); 
  return { path, cleanup, mime: 'text/plain', ext: 'txt' };
}

/* ---------- 工具：把任意文本写成临时 txt 文件 ---------- */
async function buildDocFromText(text) {
  const { path, cleanup } = await tmp.file({ postfix: '.txt' });
  await fs.writeFile(path, text, 'utf8');
  return {
    path,
    cleanup,
    mime: 'text/plain',
    ext: 'txt',
  };
}

module.exports = {
  buildText,            // 旧：问答版
  buildDoc,             // 旧：写问答版到临时txt
  buildFullReportText,  // 新：Full Report 文本
  buildDocFromText,     // 新：把任意文本写临时txt
};
