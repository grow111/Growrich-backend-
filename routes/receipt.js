And add this inside `routes/receipt.js`:

```js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const Receipt = require('../models/Receipt');

// Set up multer storage
const storage = multer.diskStorage({
destination: (req, file, cb) => {
 cb(null, 'uploads/'); // You must ensure this folder exists
},
filename: (req, file, cb) => {
 cb(null, `${Date.now()}_${file.originalname}`);
},
});
const upload = multer({ storage });

// Email transporter setup
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
 user: process.env.ADMIN_EMAIL,
 pass: process.env.ADMIN_EMAIL_PASS,
},
});

// Route: upload receipt
router.post('/upload', upload.single('receipt'), async (req, res) => {
try {
 const receipt = new Receipt({
   user: req.body.userId,
   imageUrl: req.file.path,
 });
 await receipt.save();

 // Send email to admin
 const mailOptions = {
   from: process.env.ADMIN_EMAIL,
   to: process.env.ADMIN_EMAIL,
   subject: '📩 New Payment Receipt Uploaded',
   text: `A user has uploaded a new receipt.`,
   attachments: [
     {
       filename: req.file.originalname,
       path: req.file.path,
     },
   ],
 };

 await transporter.sendMail(mailOptions);
 res.status(200).json({ message: 'Receipt uploaded and email sent.' });
} catch (err) {
 console.error('Receipt upload failed:', err);
 res.status(500).json({ error: 'Upload failed' });
}
});

module.exports = router;
