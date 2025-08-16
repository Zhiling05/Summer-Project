require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

// 导入路由模块
const assessmentsRoutes = require('./routes/assessments');
const exportRoutes = require('./routes/export');
const mailRoutes = require('./routes/mail');
const reportRoutes = require('./routes/report');
// 创建Express应用
const app = express();
const PORT = process.env.PORT || 4000;

// 创建全局邮件发送器
global.transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS配置 - 允许前端访问API
const allowedOrigins = process.env.FRONTEND_ORIGIN 
  ? process.env.FRONTEND_ORIGIN.split(',') 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// 连接MongoDB数据库
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// API路由注册
app.use('/api', assessmentsRoutes);
app.use('/api', exportRoutes);
app.use('/api', mailRoutes);
app.use('/api', reportRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongoConnection: mongoose.connection.readyState === 1
  });
});

// // API Documentation
// app.get('/api-docs', (req, res) => {
//   res.sendFile(path.join(__dirname, 'api-docs.html'));
// });

// 生产环境下提供静态文件服务
if (process.env.NODE_ENV === 'production') {
  const frontendBuildDir = path.join(__dirname, '../docs/dist');
  
  try {
    // 检查dist目录是否存在
    if (require('fs').existsSync(frontendBuildDir)) {
      console.log(`Serving static files from: ${frontendBuildDir}`);
      
      app.use(express.static(frontendBuildDir));
      
      app.get('*', (req, res) => {
        res.sendFile(path.join(frontendBuildDir, 'index.html'));
      });
    } else {
      console.warn(`Frontend build directory doesn't exist: ${frontendBuildDir}`);
      console.warn('Please run npm run build in docs directory to generate frontend build files');
    }
  } catch (err) {
    console.error(`Error checking frontend build directory:`, err);
  }
}

app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    console.log(`Email service configured with ${process.env.SMTP_HOST}`);
  } else {
    console.warn('Email service not configured! Set SMTP_* environment variables.');
  }
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// /** ----- CORS（本地 & 线上通用） ----- **/
// const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
// // 支持用环境变量 FRONTEND_ORIGIN 配置多个来源，逗号分隔
// const envOrigins = process.env.FRONTEND_ORIGIN
//   ? process.env.FRONTEND_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
//   : [];
// const allowOrigins = envOrigins.length ? envOrigins : defaultOrigins;

// app.use(cors({
//   origin: allowOrigins,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// app.use(express.json());

// /** ----- MongoDB 连接 ----- **/
// const uri = process.env.MONGO_URI; // 统一使用 MONGO_URI
// console.log('⮕ Using Mongo URI =', uri ? '(provided)' : '(missing!)');

// if (!uri) {
//   console.warn('⚠️  MONGO_URI 未提供，服务将仅提供无数据库的路由。');
// } else {
//   mongoose.connect(uri)
//     .then(() => console.log('✅ Connected to MongoDB'))
//     .catch(err => {
//       console.error('❌ MongoDB connection error:', err);
//       // 线上部署建议直接退出，避免“假活着”的实例
//       process.exit(1);
//     });
// }

// /** ----- 路由 ----- **/
// app.get('/', (_req, res) => {
//   res.send('DIPP Server is running. See /healthz and /api.');
// });

// // 健康检查（Render/Railway 可用）
// app.get('/healthz', (_req, res) => {
//   const state = mongoose.connection?.readyState ?? 0; // 0=disconnected, 1=connected
//   res.json({
//     status: 'ok',
//     db: state === 1 ? 'connected' : 'disconnected',
//     pid: process.pid,
//     time: new Date().toISOString(),
//   });
// });

// app.use('/api', require('./routes/assessments'));
// app.use('/api', require('./routes/report'));
// app.use('/api', require('./routes/export'));
// app.use('/api', require('./routes/mail'));     // lsy新增：挂载发邮件路由
// console.log('[index] mounted /routes/mail under /api'); // 加这一行

// /** ----- 启动 ----- **/
// const PORT = process.env.PORT || 4000; // Railway/Render 会注入 PORT
// app.listen(PORT, () => {
//   console.log(`🚀 Server listening on http://localhost:${PORT}`);
//   console.log('   CORS allowed origins:', allowOrigins);
// });
