const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');
const User = require('../models/User');

// === Reinvestment Route ===
router.post('/reinvest', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;

    if (![5000, 10000, 15000].includes(amount)) {
      return res.status(400).json({ error: 'Invalid reinvestment amount' });
    }

    const user = await User.findById(userId);

    // Check if user is eligible to reinvest
    const lastInvestment = await Investment.findOne({ user: userId }).sort({ endDate: -1 });
    if (!lastInvestment || !lastInvestment.withdrawn) {
      return res.status(400).json({ error: 'You must complete previous investment cycle before reinvesting' });
    }

    const newInvestment = new Investment({
      user: userId,
      amount,
      status: 'pending',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
    });

    await newInvestment.save();

    // Track reinvestment
    user.reinvestHistory.push({ date: new Date(), amount });
    user.hasWithdrawnAfterLastReinvest = false;
    await user.save();

    res.json({ message: 'Reinvestment created. Please upload your payment receipt.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Reinvestment failed' });
  }
});

module.exports = router;
