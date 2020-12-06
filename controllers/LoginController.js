const express = require('express');
const debug = require('debug')('app:auth');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const User = require('../models/User');
const JwtPublish = require('../auth/JwtPublish');
const { JwtStoreContent } = require('../auth/JwtStructure');
const HttpStatusCodes = require('../constants/HttpStatusCodes');

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { email, password: inputPw } = req.body;
    /*
  1. salt, password는 민감 정보이므로 의도적으로 Select 하지 않음.
  2. deleted를 뺀 이유:
      (1) 대부분의 회원이 일반 회원이고,
      (2) deleted: true이면 로그인할 수도 없을 것이기 때문
  */
    const user = await User.findOne({ email }).select('+password +salt -deleted').exec();
    debug('user: %o', user);
    if (user === null || !user.comparePassword(inputPw)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send('계정이 존재하지 않거나 잘못된 요청입니다.');
    }
    const { password, salt, ...userInfo } = user.toObject();
    const payload = JwtStoreContent(user);
    res.status(HttpStatusCodes.OK).json({
      ...userInfo,
      accessToken: JwtPublish(payload, false),
      refreshToken: JwtPublish(payload, true),
    });
  }),
);

module.exports = router;
