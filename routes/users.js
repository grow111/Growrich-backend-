// routes/users.js
const express = require('express');
const router = express.Router();

// Example route - you can add more based on your logic
router.get('/', (req, res) => {
  res.send('Users route working ✅');
});

module.exports = router;
