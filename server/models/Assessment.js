// server/models/Assessment.js
// =================================
// 伪造一个 Mongoose 风格的 Model，只实现 findById
// 数据来源同 routes/assessments.js 里的那个 Map
// =================================

const { assessments } = require('../routes/assessments');

module.exports = {
  /**
   * Stub for Assessment.findById(id)
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  findById: async function(id) {
    // Map.get 如果没找到就返回 undefined → 转成 null
    return assessments.get(id) || null;
  }
};
