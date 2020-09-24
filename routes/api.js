const express = require('express');

const router = express.Router();

const auth = require('../auth/JwtFilter');

/* GET users listing. */
router.get('/', auth, (req, res) => {
  const { headers } = req;
  res.json({ headers });
});

module.exports = router;
