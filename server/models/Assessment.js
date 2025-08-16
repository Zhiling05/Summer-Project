const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AssessmentSchema = new Schema({
  role: { type: String, enum: ['optometrist','gp','patient'], required: true },
  content: { type: String, default: '' },   // 建议用 default，避免因空串报 500
  recommendation: { 
    type: String, 
    enum: [
      'EMERGENCY_DEPARTMENT', 
      'IMMEDIATE', 
      'URGENT_TO_OPH', 
      'URGENT_TO_GP_OR_NEUR', 
      'TO_GP', 
      'NO_REFERRAL', 
      'OTHER_EYE_CONDITIONS_GUIDANCE'
    ]
  },
  answers: [
    { 
      questionId: { type: String, required: true },
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }
  ],
  symptoms: { type: [String], default: [] },  
  createdAt: { type: Date, default: Date.now }
});


AssessmentSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 90,
    partialFilterExpression: { role: 'optometrist' }
  }
);

// 为常用查询添加索引
AssessmentSchema.index({ role: 1, recommendation: 1 }); // 用于风险级别统计
AssessmentSchema.index({ createdAt: -1 }); // 用于日期排序和筛选
module.exports = mongoose.model('Assessment', AssessmentSchema);