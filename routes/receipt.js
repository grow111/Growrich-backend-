const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");

// Use memory storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle receipt uploads
router.post("/upload", upload.single("receipt"), async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Setup the Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Prepare the email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // send to admin
      subject: "New Manual Payment Receipt Upload - GrowRich",
      text: `Name: ${name}\nEmail: ${email}\n\nA new payment receipt has been uploaded.`,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ],
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Receipt uploaded and email sent to admin." });
  } catch (error) {
    console.error("Error uploading receipt or sending email:", error);
    res.status(500).json({ error: "Something went wrong while processing the receipt." });
  }
});

module.exports = router;
