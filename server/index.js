require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api', require('./routes/assessments'));
app.use('/api', require('./routes/report'));
app.use('/api', require('./routes/export'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Stub server listening on http://localhost:${PORT}`);
});