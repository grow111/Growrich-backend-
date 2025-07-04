const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const investRoutes = require('./routes/invest');
const withdrawRoutes = require('./routes/withdraw');
const reinvestRoutes = require('./routes/reinvest');
const receiptRoutes = require('./routes/receipt');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api', investRoutes);
app.use('/api', withdrawRoutes);
app.use('/api', reinvestRoutes);
app.use('/api', receiptRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));
