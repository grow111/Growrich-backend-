const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  investmentAmount: { type: Number, default: 0 },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  investments: [{
    amount: Number,
    investedAt: Date,
    payoutAt: Date,
    isWithdrawn: { type: Boolean, default: false }
  }],
  receipt: {
    filename: String,
    originalname: String,
    uploadedAt: Date
  }
});

module.exports = mongoose.model('User', userSchema);
