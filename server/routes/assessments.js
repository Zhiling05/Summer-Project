const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

// 新建记录
router.post('/', async (req, res) => {
  try {
    const newAssessment = new Assessment(req.body);
    const saved = await newAssessment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 获取所有记录
router.get('/', async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 根据 ID 获取单条记录
router.get('/:id', async (req, res) => {
  try {
    const a = await Assessment.findById(req.params.id);
    res.json(a);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

module.exports = router;
