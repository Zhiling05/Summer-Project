// server/routes/report.js
const express      = require('express');
const { assessments } = require('./assessments');
const router       = express.Router();

/* GET /api/assessments/:id/report —— 返回纯文本 */
router.get('/assessments/:id/report', (req, res) => {
  const { buildText, buildDoc } = require('../utils/doc');   // 每次请求即时拿，避开循环引用
  console.log('utils/doc keys =', Object.keys(require('../utils/doc')));  // <— 调试

  const ass = assessments.get(req.params.id);
  if (!ass) return res.status(404).send('Not Found');

  res.type('text/plain').send(buildText(ass));
});

module.exports = router;
