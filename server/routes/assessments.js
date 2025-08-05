const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

router.get('/assessments', async (req, res) => {
  try {
    const records = await Assessment.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/assessments/:id', async (req, res) => {
  try {
    const record = await Assessment.findById(req.params.id);
    if (!record) return res.status(404).json({ error: 'Assessment not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/assessments', async (req, res) => {
  try {
    const newRecord = await Assessment.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;