const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  isConfirmed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Receipt', receiptSchema);
