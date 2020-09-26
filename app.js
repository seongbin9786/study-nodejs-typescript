const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

// Documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./openapi.yml');

// Security
require('./db_init');
require('./passport_init');
const multer = require('multer');
const JwtFilter = require('./auth/JwtFilter');
const AnonymousCredentialProvider = require('./auth/AnonymousCredentialProvider');

const upload = multer({});

const userRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const refreshRouter = require('./routes/refresh');
const GlobalErrorHandler = require('./middlewares/GlobalErrorHandler');

const app = express();

app.use(logger('dev'));
app.use(express.json()); // body-parser가 express로 merge됨.
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(JwtFilter);
app.use(AnonymousCredentialProvider);

app.use('/users', userRouter);
app.use('/register', upload.none(), registerRouter); // POST /users 여야 맞지만 middleware exception을 모르겠다.
app.use('/login', upload.none(), loginRouter);
app.use('/refresh', upload.none(), refreshRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use(GlobalErrorHandler);

module.exports = app;
