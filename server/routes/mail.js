// routes/mail.js
const express = require('express');
const Assessment = require('../models/Assessment');
const { buildDoc } = require('../utils/doc');
const { sendAssessmentMail } = require('../utils/mailer');
const router = express.Router();

router.post('/send-report', async (req, res, next) => {
  try {
    const { assessmentId, emailTo, format = 'txt' } = req.body;
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).send('Not found');

    const { path, cleanup } = await buildDoc(assessment, format);
    await sendAssessmentMail({
      to: emailTo,
      subject: `Assessment ${assessmentId}`,
      text: 'See attachment.',
      attachmentPath: path,
    });
    cleanup();
    res.json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
