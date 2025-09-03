require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const docRoutes = require('./routes/docs');
const searchRoutes = require('./routes/search');
const qaRoutes = require('./routes/qa');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI or MONGODB_URI is not set. See .env.example');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

app.use('/api/auth', authRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/qa', qaRoutes);

// Serve static client if present
const clientBuild = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientBuild));
app.get('*', (req,res)=> {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`Server running on ${port}`));
