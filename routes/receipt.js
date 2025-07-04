const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const Receipt = require('../models/receipt');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// POST /api/upload-receipt
router.post('/upload-receipt', upload.single('receipt'), async (req, res) => {
  try {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const newReceipt = new Receipt({
      user: req.body.userId,
      imageUrl
    });
    await newReceipt.save();

    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"GrowRichInvestments" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Payment Receipt Uploaded',
      html: `<p>A new receipt has been uploaded by a user.</p><p><a href="${imageUrl}" target="_blank">View Receipt</a></p>`
    });

    res.status(201).json({ message: 'Receipt uploaded and email sent to admin' });
  } catch (err) {
    console.error('Error uploading receipt:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
