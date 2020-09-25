const express = require('express');
const debug = require('debug')('app:auth');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const User = require('../models/User');
const JwtPublish = require('../auth/JwtPublish');

router.post('/', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user === null) {
    return res.status(400).send('계정이 존재하지 않거나 잘못된 요청입니다.');
  }
  const jwt = JwtPublish({ id: user._id }, false);

  debug(user);

  res.status(200).json({
    email: user.email,
    name: user.name,
    token: jwt,
  });
}));

module.exports = router;
