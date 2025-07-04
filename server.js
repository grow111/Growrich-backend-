const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/investments', require('./routes/investments'));
app.use('/api/withdrawals', require('./routes/withdrawals'));
app.use('/api/receipts', require('./routes/receipt')); // receipt upload/notification

// Render Port Binding (important)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
