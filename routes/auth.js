const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// === GMAIL CONFIG ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL, // e.g. ksomtochukwu38@gmail.com
    pass: process.env.EMAIL_PASS   // App password
  }
});

// === Signup ===
router.post('/signup', async (req, res) => {
  const { email, password, referralCode } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashed,
      referralCode: Math.random().toString(36).substr(2, 6)
    });

    // Handle referrals
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id;
        referrer.referrals.push(user._id);
        await referrer.save();
      }
    }

    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// === Login ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// === Get Current User ===
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).populate('referrals');
  res.json({ user });
});

module.exports = router;
