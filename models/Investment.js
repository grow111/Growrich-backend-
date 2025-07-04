const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
    enum: ['5000', '10000', '15000'],
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'matured', 'withdrawn'],
    default: 'active',
  },
  receipt: {
    type: String, // path or URL of uploaded receipt
  },
});

module.exports = mongoose.model('Investment', investmentSchema);
