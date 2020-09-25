const express = require('express');
const debug = require('debug')('app:register');

const router = express.Router();

const JwtPublish = require('../auth/JwtPublish');

const User = require('../models/User');

router.post('/', (req, res) => {
  const { email, password, name } = req.body;
  User.findOne({ email }, (err, check) => {
    if (check) {
      res.status(400).send('중복된 계정입니다.');
      return;
    }
    if (err) {
      res.status(500).send('서버 오류가 발생했습니다.');
      return;
    }
    const user = new User({ email, password, name });
    user.save()
      .then(({ id }) => {
        if (err) {
          debug(err);
          res.status(500).send('서버 오류가 발생했습니다.');
          return;
        }
        res.status(201).json({
          id,
          email,
          name,
          token: JwtPublish(id, false),
        });
      }).catch((dbError) => {
        debug(dbError);
        res.status(500).send(`서버 오류가 발생했습니다: ${dbError}`);
      });
  });
});

module.exports = router;
