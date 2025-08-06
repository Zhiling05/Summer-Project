const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssessmentSchema = new Schema({
  role: {
    type: String,
    enum: ['optometrist', 'gp', 'patient'],
    required: true
  },
  content: { type: String, required: true },
  patientId: String,
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