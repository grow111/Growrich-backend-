const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Investment = require('../models/Investment');
const User = require('../models/User');

// === Withdraw Request ===
router.post('/withdraw', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get latest approved investment
    const investment = await Investment.findOne({ user: userId, status: 'approved' }).sort({ endDate: -1 });

    if (!investment) {
      return res.status(400).json({ error: 'No approved investment found' });
    }

    const now = new Date();
    if (investment.endDate > now) {
      return res.status(400).json({ error: 'Investment has not matured yet' });
    }

    const user = await User.findById(userId);

    // Check referral requirement based on reinvestment history
    const reinvestCount = user.reinvestHistory.length;
    const requiredReferrals = reinvestCount === 0 ? 2 : 1;

    if (user.referrals.length < requiredReferrals) {
      return res.status(400).json({ error: `You need ${requiredReferrals} referral(s) to withdraw` });
    }

    if (user.hasWithdrawnAfterLastReinvest) {
      return res.status(400).json({ error: 'You must reinvest again before you can withdraw again' });
    }

    // Mark withdrawal status
    investment.withdrawn = true;
    await investment.save();

    user.hasWithdrawnAfterLastReinvest = true;
    await user.save();

    res.json({ message: 'Withdrawal approved. You will be paid manually.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

module.exports = router;
