var express = require('express');
var router = express.Router();

var User = require('../models/User');

var jwtPublisher = require('../auth/JwtPublisher');

router.post('/', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user === null) { // Promise라서 next()를 호출해줘야 함.
      res.status(400).json();
      return next();
    }
    const jwt = jwtPublisher(user._id);

    res.status(200).json({
        email: user.email,
        name: user.name,
        token: jwt
    });
});

module.exports = router;
