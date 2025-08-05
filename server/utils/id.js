const DAILY_COUNTER = Object.create(null);
const COLOR_PREFIX  = { red: 'HR', orange: 'MR', green: 'LR' };

module.exports = function buildCustomId(severity, createdAtISO) {
  const prefix  = COLOR_PREFIX[severity] || 'HR';
  const dateStr = createdAtISO.slice(0, 10).replace(/-/g, '_');
  const key = dateStr; 
  const seq     = (DAILY_COUNTER[key] = (DAILY_COUNTER[key] || 0) + 1);
  return `${prefix}_${dateStr}_${String(seq).padStart(5, '0')}`;
};
