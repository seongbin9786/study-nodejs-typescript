var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

require('./db_init');
require('./passport_init');

var multer = require('multer');
var upload = multer({});

var apiRouter = require('./routes/api');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var app = express();

app.use(logger('dev'));
app.use(express.json()); // body-parser가 express로 merge됨.
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/api', passport.authenticate('jwt', { session: false }), apiRouter);
app.use('/register', upload.none(), registerRouter); // POST /users 여야 맞지만 middleware exception을 모르겠다.
app.use('/login', upload.none(), loginRouter);

module.exports = app;
