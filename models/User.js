const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  amount: Number,
  investedAt: { type: Date, default: Date.now },
  payoutAt: Date,
  isWithdrawn: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  investmentAmount: { type: Number, default: 0 },
  investments: [investmentSchema],
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  paymentReceipt: { type: String, default: '' },
  isPaid: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
