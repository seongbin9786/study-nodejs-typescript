var express = require('express');
var router = express.Router();

var auth = require('../auth/JwtFilter');

/* GET users listing. */
router.get('/', auth, function(req, res) {
  const { headers } = req;
  res.json({ headers });
});

module.exports = router;
