// server/models/Assessment.js
// 仅提供 findById，内部转到 routes/assessments.js 的内存 Map

const { assessments } = require('../routes/assessments');

/**
 * Stub for Assessment.findById(id)
 * @param  {string} id
 * @return {Promise<object|null>}
 */
exports.findById = async function (id) {
  // Map.get 找不到时返回 undefined，我们转成 null
  return assessments.get(id) || null;
};
