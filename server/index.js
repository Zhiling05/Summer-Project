// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

/** ----- CORS（本地 & 线上通用） ----- **/
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
// 支持用环境变量 FRONTEND_ORIGIN 配置多个来源，逗号分隔
const envOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
  : [];
const allowOrigins = envOrigins.length ? envOrigins : defaultOrigins;

app.use(cors({
  origin: allowOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

/** ----- MongoDB 连接 ----- **/
const uri = process.env.MONGO_URI; // 统一使用 MONGO_URI
console.log('⮕ Using Mongo URI =', uri ? '(provided)' : '(missing!)');

if (!uri) {
  console.warn('⚠️  MONGO_URI 未提供，服务将仅提供无数据库的路由。');
} else {
  mongoose.connect(uri)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      // 线上部署建议直接退出，避免“假活着”的实例
      process.exit(1);
    });
}

/** ----- 路由 ----- **/
app.get('/', (_req, res) => {
  res.send('DIPP Server is running. See /healthz and /api.');
});

// 健康检查（Render/Railway 可用）
app.get('/healthz', (_req, res) => {
  const state = mongoose.connection?.readyState ?? 0; // 0=disconnected, 1=connected
  res.json({
    status: 'ok',
    db: state === 1 ? 'connected' : 'disconnected',
    pid: process.pid,
    time: new Date().toISOString(),
  });
});

app.use('/api', require('./routes/assessments'));
app.use('/api', require('./routes/report'));
app.use('/api', require('./routes/export'));

/** ----- 启动 ----- **/
const PORT = process.env.PORT || 4000; // Railway/Render 会注入 PORT
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log('   CORS allowed origins:', allowOrigins);
});
