// server/utils/doc.js
const fs  = require('fs-extra');
const tmp = require('tmp-promise');

async function buildDoc(assessment, format = 'txt') {
  if (format !== 'txt') {
    const err = new Error('only txt supported');
    err.status = 501;
    throw err;
  }

  const { path, cleanup } = await tmp.file({ postfix: '.txt' });

  const body = [
    `Assessment ${assessment.id}`,
    `Patient   : ${assessment.patientId}`,
    `Date      : ${assessment.createdAt}`,
    `Role      : ${assessment.role}`,
    '----------------------------------------',
    ...assessment.answers.map(a => `${a.questionId}: ${a.answer}`),
    '----------------------------------------',
    `Recommendation: ${assessment.recommendation}`,
    '',
  ].join('\n');

  await fs.writeFile(path, body, 'utf8');
  return { path, cleanup, mime: 'text/plain', ext: 'txt' };
}

module.exports = { buildDoc };   // 只有这一行导出
