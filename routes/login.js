const express = require('express');
const debug = require('debug')('app:auth');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const User = require('../models/User');
const JwtPublish = require('../auth/JwtPublish');
const { JwtStoreContent } = require('../auth/JwtStructure');

router.post('/', asyncHandler(async (req, res) => {
  const { email, password: inputPw } = req.body;
  // salt, password를 의도적으로 Select
  const user = await User.findOne({ email }).select('+password +salt').exec();
  debug('user: %o', user);
  if (user === null || !user.comparePassword(inputPw)) {
    return res.status(400).send('계정이 존재하지 않거나 잘못된 요청입니다.');
  }
  const {
    password, salt, ...userInfo
  } = user.toObject();
  const payload = JwtStoreContent(user);
  res.status(200).json({
    ...userInfo,
    accessToken: JwtPublish(payload, false),
    refreshToken: JwtPublish(payload, true),
  });
}));

module.exports = router;
