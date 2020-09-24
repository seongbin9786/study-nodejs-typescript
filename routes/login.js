const express = require('express');

const router = express.Router();
const User = require('../models/User');
const jwtPublisher = require('../auth/JwtPublisher');

router.post('/', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user === null) { // Promise라서 next()를 호출해줘야 함.
    res.status(400).send('계정이 존재하지 않거나 잘못된 요청입니다.');
    return next();
  }
  const jwt = jwtPublisher(user._id);

  res.status(200).json({
    email: user.email,
    name: user.name,
    token: jwt,
  });
});

module.exports = router;
