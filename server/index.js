// server/index.js
require('dotenv').config();   // 一定要放在第一行加载环境变量

const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ───────── 业务路由 ───────── */
app.use('/api', require('./routes/report'));        // 纯文本预览：GET /api/assessments/:id/report
app.use('/api', require('./routes/assessments'));   // 提交+获取评估：POST /api/assessments, GET /api/assessments/:id
app.use('/api', require('./routes/export'));        // 导出 PDF：GET /api/assessments/:id/export
app.use('/api', require('./routes/mail'));          // 发送邮件：POST /api/send-report

/* ───────── 统计接口（Mock 示例）───────── */
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

/* ───────── 启动服务器 ───────── */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Stub server listening on http://localhost:${PORT}`)
);
