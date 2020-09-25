const express = require('express');
const jwt = require('jsonwebtoken');
const debug = require('debug')('app:auth');
const asyncHandler = require('express-async-handler');

const router = express.Router();

const { JwtSecret } = require('../auth/JwtPolicy');
const JwtPublish = require('../auth/JwtPublish');
const { JwtStoreId } = require('../auth/JwtStructure');

/*
  TODO:
  1. Redis 사용
  2. 각종 폼의 validation, error hadnling 구현
  3.
*/
router.post('/', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  // TODO: refreshToken이 없을 때 예외처리
  jwt.verify(refreshToken, JwtSecret, (err, decoded) => {
    if (err) {
      debug(`Jwt Verify Error: ${err.message}`);
      res.status(400).send('토큰이 만료되었거나 비정상 리프레시 토큰입니다.');
      return;
    }
    const payload = JwtStoreId(decoded);
    res.status(200).json({
      accessToken: JwtPublish(payload, false),
      refreshToken: JwtPublish(payload, true),
    });
  });
}));

module.exports = router;
