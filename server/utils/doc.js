const fs = require('fs-extra');
const tmp = require('tmp-promise');

/* Recommendation code to readable text mapping */
const RECOMMEND_TEXT = {
  EMERGENCY_DEPARTMENT: 'Send patient to Emergency Department immediately',
  IMMEDIATE: 'Immediate referral to Eye Emergency On-Call',
  URGENT_TO_OPH: 'Urgent referral to Ophthalmologist',
  URGENT_TO_GP_OR_NEUR: 'Urgent referral to GP or Neurologist',
  TO_GP: 'Refer to General Practitioner',
  NO_REFERRAL: 'No referral required',
  OTHER_EYE_CONDITIONS_GUIDANCE: 'Referral to other department',
};

/* 
 * Build complete report text from assessment data
 * ass: assessment object with assessmentId, createdAt, symptoms, recommendation
 */
function buildFullReportText(ass) {
  /* Format date for better readability */
  const dateStr = ass.createdAt
    ? new Date(ass.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Date not available';

  /* Format symptoms list */
  const symptoms = (ass.symptoms && ass.symptoms.length)
    ? ass.symptoms.map(s => `- ${s}`).join('\n')
    : 'No symptoms recorded.';

  /* Get recommendation text */
  const recommendation = RECOMMEND_TEXT[ass.recommendation] || ass.recommendation || 'No recommendation provided';

  /* Build formatted report */
  return [
    'ASSESSMENT REPORT',
    '================',
    '',
    `Assessment ID: ${ass.assessmentId || 'N/A'}`,
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

/* 
 * Create temporary text file from string content
 * text: string content to write to file
 * Returns: object with path, cleanup function, mime type, and extension
 */
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
  buildFullReportText,
  buildDocFromText,
};