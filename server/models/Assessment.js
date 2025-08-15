const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const AssessmentSchema = new Schema({
//   role: {
//     type: String,
//     enum: ['optometrist', 'gp', 'patient'],
//     required: true
//   },
//   content: { type: String, required: true },
//   patientId: String,
//   createdAt: { type: Date, default: Date.now }
// });
const AssessmentSchema = new Schema({
  role: { type: String, enum: ['optometrist','gp','patient'], required: true },
  patientId: String,
  content: { type: String, default: '' },   // 建议用 default，避免因空串报 500
  recommendation: String,                    // 新增
  answers: [                                 // 新增
    { questionId: String, question: String, answer: String }
  ],
  symptoms: [String],
  createdAt: { type: Date, default: Date.now }
});


AssessmentSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 90,
    partialFilterExpression: { role: 'optometrist' }
  }
);

module.exports = mongoose.model('Assessment', AssessmentSchema);