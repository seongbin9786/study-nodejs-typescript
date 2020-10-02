const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:register');

const router = express.Router();

const JwtPublish = require('../auth/JwtPublish');

const User = require('../models/User');

// TODO: validate email is present and is in string format.
// (이거 좀 SQL Injection처럼 공격 대상 될 수 있을 거 같은데..)
router.post('/', (req, res) => {
  User.findOne({ email: req.body.email }, (_, found) => {
    if (found) {
      return res.status(400).send('중복된 계정입니다.');
    }
    debug('body: %o', req.body);
    debug('user: %o', req.user);
    if (req.body.role && (!req.user || !req.user.checkPermission('관리자'))) {
      return res.status(403).send('권한이 부족합니다.');
    }
    const newUser = new User(req.body);
    // 이렇게 callback으로 수행하면,
    // 여기서 catch하지 않으면 globalErrorHandler로 나가지 않네.
    // 그렇다고 save에 wrap을 할 수도 없고..
    newUser.save()
      .then(({ id, email, name }) => res.status(201).json({
        id,
        email,
        name,
        token: JwtPublish(({ id }), false),
      })).catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          const errors = Object.values(err.errors);
          const msgs = errors.reduce((acc, e) => {
            acc[e.path] = e.kind;
            return acc;
          }, {});
          return res.status(400).json(msgs);
        }
        debug('Error while saving: %o', err);
        return res.status(500).send(`서버 오류가 발생했습니다: ${err.message}`);
      });
  });
});

module.exports = router;
