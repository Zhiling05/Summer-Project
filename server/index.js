// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
//
// const app = express();
// app.use(cors());
// app.use(express.json());
//
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));
//
// app.use('/api', require('./routes/assessments'));
// app.use('/api', require('./routes/report'));
// app.use('/api', require('./routes/export'));
//
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`🚀 Stub server listening on http://localhost:${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

const app = express();
// app.use(cors());

const corsOptions = {
  origin: 'http://localhost:5173',   // 前端实际地址；不要 '*'
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOptions));


app.use(express.json());

console.log('⮕ Using Mongo URI =', uri);

if (uri) {
  mongoose
      .connect(uri)
      .then(() => console.log('✅ Connected to MongoDB'))
      .catch(err => console.error('❌ MongoDB connection error:', err));
} else {
  console.warn('⚠️ No Mongo URI provided, skipping DB connection');
}

app.use('/api', require('./routes/assessments'));
app.use('/api', require('./routes/report'));
app.use('/api', require('./routes/export'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Stub server listening on http://localhost:${PORT}`);
});

