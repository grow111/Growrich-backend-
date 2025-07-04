// routes/investments.js
const express = require('express');
const router = express.Router();

// Sample route (you can replace with your actual investment logic)
router.get('/', (req, res) => {
  res.send('Investments route is working ✅');
});

module.exports = router;
