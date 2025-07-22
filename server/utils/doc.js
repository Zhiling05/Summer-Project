// server/utils/doc.js
/* ---------------------------------------------------------
 * 负责把一条 assessment
 *   ① 转成纯文本（buildText）
 *   ② （目前仅支持 txt）写入临时文件并返回下载信息（buildDoc）
 * --------------------------------------------------------*/

const fs  = require('fs-extra');
const tmp = require('tmp-promise');

/* ---------- 1. 转成纯文本 ---------- */
function buildText(ass) {
  return [
    `Assessment ${ass.id}`,
    `Patient   : ${ass.patientId}`,
    `Date      : ${ass.createdAt}`,
    `Role      : ${ass.role}`,
    '----------------------------------------',
    ...ass.answers.map(
      a =>
        `${a.questionId}: ${a.question || '(question text missing)'}\n` +
        `Answer    : ${a.answer}\n`
    ),
    '----------------------------------------',
    `Recommendation: ${ass.recommendation}`,
    '',
  ].join('\n');
}

/* ---------- 2. 生成临时文件 ---------- */
async function buildDoc(ass, format = 'txt') {
  if (format !== 'txt') {
    const err      = new Error('only txt supported');
    err.status     = 501;      // 501 Not Implemented
    throw err;
  }

  const { path, cleanup } = await tmp.file({ postfix: '.txt' });
  await fs.writeFile(path, buildText(ass), 'utf8');

  return {
    path,            // 临时文件路径
    cleanup,         // 调用后删除
    mime: 'text/plain',
    ext : 'txt',
  };
}

/* ---------- 3. 统一导出（只此一次！） ---------- */
module.exports = {
  buildText,
  buildDoc,
};
