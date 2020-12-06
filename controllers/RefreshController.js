const express = require('express');
const jwt = require('jsonwebtoken');
const debug = require('debug')('app:auth');
const asyncHandler = require('express-async-handler');

const router = express.Router();

const { JwtSecret } = require('../auth/JwtPolicy');
const JwtPublish = require('../auth/JwtPublish');
const { JwtStoreContent } = require('../auth/JwtStructure');
const HttpStatusCodes = require('../constants/HttpStatusCodes');

/*
  TODO:
  1. Redis 사용
  2. Update와 Create 시에 Validation 추가
  3.
*/
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(HttpStatusCodes.BAD_REQUEST).send('토큰이 만료되었거나 비정상 리프레시 토큰입니다.');
    }
    jwt.verify(refreshToken, JwtSecret, (err, decoded) => {
      if (err) {
        debug(`Jwt Verify Error: ${err.message}`);
        return res.status(HttpStatusCodes.BAD_REQUEST).send('토큰이 만료되었거나 비정상 리프레시 토큰입니다.');
      }
      const payload = JwtStoreContent(decoded);
      res.status(HttpStatusCodes.OK).json({
        accessToken: JwtPublish(payload, false),
        refreshToken: JwtPublish(payload, true),
      });
    });
  }),
);

module.exports = router;
