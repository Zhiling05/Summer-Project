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


function buildFullReportText(ass) {
  // 格式化日期为更易读的形式
  const dateStr = ass.createdAt
    ? new Date(ass.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Date not available';

  // 格式化症状列表
  const symptoms = (ass.symptoms && ass.symptoms.length)
    ? ass.symptoms.map(s => `- ${s}`).join('\n')
    : 'No symptoms recorded.';

  // 获取推荐文本
  const recommendation = RECOMMEND_TEXT[ass.recommendation] || ass.recommendation || 'No recommendation provided';

  // 拼接简化版报告
  return [
    'ASSESSMENT REPORT',
    '================',
    '',
        `Assessment ID: ${ass.assessmentId || 'N/A'}`,  // 新增这行
    `Date: ${dateStr}`,
    '',
    'SYMPTOMS:',
    symptoms,
    '',
    'RECOMMENDATION:',
    recommendation,
    '',
  ].join('\n');
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
  buildFullReportText,  // 简化版报告文本
  buildDocFromText,     // 把任意文本写临时txt
};
