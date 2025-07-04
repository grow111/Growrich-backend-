const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Investment = require('../models/Investment');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// === Upload setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// === Email setup ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

// === Manual Investment with Receipt Upload ===
router.post('/invest', auth, upload.single('receipt'), async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId;
    const receiptPath = req.file ? req.file.path : null;

    const newInvestment = new Investment({
      user: userId,
      amount,
      status: 'pending',
      receipt: receiptPath
    });

    await newInvestment.save();

    // Send email to admin
    await transporter.sendMail({
      from: `"GrowRich" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Manual Payment Receipt Uploaded',
      html: `<p>User ${userId} has uploaded a receipt for a ₦${amount} investment.</p><p><b>Confirm manually in the admin dashboard or MongoDB.</b></p>`
    });

    res.json({ message: 'Investment submitted. Awaiting confirmation.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Investment failed.' });
  }
});

// === Confirm investment manually (for admin use) ===
router.post('/confirm/:id', async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment) return res.status(404).json({ error: 'Investment not found' });

    investment.status = 'approved';
    investment.startDate = new Date();
    investment.endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await investment.save();

    res.json({ message: 'Investment approved.' });
  } catch (err) {
    res.status(500).json({ error: 'Confirmation failed' });
  }
});

// === Get all user's investments ===
router.get('/my-investments', auth, async (req, res) => {
  const investments = await Investment.find({ user: req.user.userId });
  res.json({ investments });
});

module.exports = router;
