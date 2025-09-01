require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authGuard = require('./middleware/auth-guard');
const path = require('path');

/* Import route modules */
const assessmentsRoutes = require('./routes/assessments');
const exportRoutes = require('./routes/export');
const reportRoutes = require('./routes/report');

/* Create Express application */
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

/* CORS configuration - allow frontend access to API */
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

/* Connect to MongoDB database */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use(cookieParser());

/* API route registration */
app.use('/api', authRoutes); /* Public routes like /api/guest */
app.use('/api', authGuard, assessmentsRoutes); /* Protected assessment routes */
app.use('/api', exportRoutes);
app.use('/api', reportRoutes);

/* Health check endpoint */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongoConnection: mongoose.connection.readyState === 1
  });
});

/* Serve static files in production */
if (process.env.NODE_ENV === 'production') {
  const frontendBuildDir = path.join(__dirname, '../docs/dist');
  
  try {
    /* Check if dist directory exists */
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

/* Global error handler */
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

/* Start server */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

/* Process error handlers */
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});