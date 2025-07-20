// server/index.js
require('dotenv').config();   // 一定要在第一行
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ───────── 业务路由 ───────── */
app.use('/api', require('./routes/assessments')); // POST /api/assessments + GET /:id

app.use('/api', require('./routes/export'));      // GET  /api/assessments/:id/export
app.use('/api', require('./routes/mail'));        // POST /api/send-report

/* ───────── 统计接口（仍放在这里） ───────── */
app.get('/api/statistics/usage', (req, res) => {
  res.json({
    startDate: req.query.startDate,
    endDate:   req.query.endDate,
    data: [
      { role: 'optometrist', count: 1 },
      { role: 'gp',          count: 0 },
      { role: 'patient',     count: 0 },
    ],
  });
});

app.get('/api/statistics/referrals', (req, res) => {
  res.json({
    role:   req.query.role,
    period: req.query.period,
    data: [
      { recommendation: 'Immediate',   count: 1 },
      { recommendation: 'NoReferral',  count: 0 },
      { recommendation: 'UrgentToOph', count: 0 },
    ],
  });
});

/* ───────── 全局错误处理 ───────── */
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message);
});

/* ───────── 服务器启动 ───────── */
const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Stub server listening on http://localhost:${PORT}`)
);
