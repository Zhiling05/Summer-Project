const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* MongoDB schema for assessment records with user isolation and automatic expiration */
const AssessmentSchema = new Schema({
  userId: { type: String, required: true },
  role: { type: String, enum: ['optometrist','gp','patient'], required: true },
  customId: { type: String, unique: true, required: true},
  content: { type: String, default: '' },
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

/* TTL index - automatically delete optometrist records after 90 days */
AssessmentSchema.index(
  { userId: 1, createdAt: -1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 90,
    partialFilterExpression: { role: 'optometrist' }
  }
);

/* Database indexes for query optimization */
AssessmentSchema.index({ role: 1, recommendation: 1 }); /* For risk level statistics */
AssessmentSchema.index({ createdAt: -1 }); /* For date sorting and filtering */
AssessmentSchema.index({ customId: 1 }); /* For unique ID lookups */

module.exports = mongoose.model('Assessment', AssessmentSchema);