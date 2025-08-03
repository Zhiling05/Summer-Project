const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssessmentSchema = new Schema({
  role: { type: String, enum: ['optometrist', 'gp', 'patient'] },
  createdAt: { type: Date, default: Date.now },
  patientId: String,
  content: String, // 示例字段
});

// 仅清理验光师数据：90天
AssessmentSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 90,
    partialFilterExpression: { role: 'optometrist' }
  }
);

module.exports = mongoose.model('Assessment', AssessmentSchema);
