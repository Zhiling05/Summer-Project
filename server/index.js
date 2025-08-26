require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authGuard  = require('./middleware/auth-guard');
const path = require('path');
// const nodemailer = require('nodemailer');

// 导入路由模块
const assessmentsRoutes = require('./routes/assessments');
const exportRoutes = require('./routes/export');
// const mailRoutes = require('./routes/mail');
const reportRoutes = require('./routes/report');
// 创建Express应用
const app = express();
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);

// CORS配置 - 允许前端访问API
// const allowedOrigins = process.env.FRONTEND_ORIGIN 
//   ? process.env.FRONTEND_ORIGIN.split(',') 
//   : ['http://localhost:5173'];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
// }));

const allowedOrigins = process.env.FRONTEND_ORIGIN 
  ? process.env.FRONTEND_ORIGIN.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174'];

// 添加前端部署域名到允许列表
allowedOrigins.push('https://dipp-frontend.onrender.com');

app.use(cors({
  origin: function(origin, callback) {
    console.log('Request origin:', origin); // 调试用
    
    // 允许无origin的请求（如移动端应用、Postman等）
    if (!origin) return callback(null, true);
    
    // 检查是否在允许列表中
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // 对于代理请求，可能origin会是前端域名
    const msg = `CORS: Origin ${origin} not allowed. Allowed origins: ${allowedOrigins.join(', ')}`;
    console.warn(msg);
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// 连接MongoDB数据库
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


// 用户隔离：把当前用户写入req.user.id
// 挂载顺序：先 /api/guest，再保护其它 /api
// const authRoutes = require('./routes/auth');
// const auth = require('./middleware/auth');
// app.use('/api', authRoutes);
// app.use('/api', auth, assessmentsRoutes);
//
//
// // 匿名cookie-用户隔离
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// app.use(cors({ origin: ['https://dipp-frontend.onrender.com'], credentials: true }));
// app.use(cookieParser());

// app.use(cors({ origin: process.env.FRONTEND_ORIGIN.split(','), credentials: true }));
app.use(cookieParser());

app.use('/api', authRoutes);                   // /api/guest 等无需鉴权

// API路由注册
app.use('/api', authGuard, assessmentsRoutes);
app.use('/api', exportRoutes);
// app.use('/api', mailRoutes);
app.use('/api', reportRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongoConnection: mongoose.connection.readyState === 1
  });
});


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
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
