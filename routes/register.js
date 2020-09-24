const express = require('express');

const router = express.Router();

const JwtPublisher = require('../auth/JwtPublisher');

const User = require('../models/User');

router.post('/', (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email }, (err, check) => {
    if (check) {
      res.status(400).send('계정이 존재하지 않거나 잘못된 요청입니다.');
      return;
    }
    if (err) {
      res.status(500).send('서버 오류가 발생했습니다.');
      return;
    }
    const user = new User({ email, password, name });
    user.save((err, { id, email, name }) => {
      if (err) {
        res.status(500).send('서버 오류가 발생했습니다.');
        return;
      }
      res.status(201).json({
        id,
        email,
        name,
        token: JwtPublisher(id),
      });
    });
  });
});

module.exports = router;
