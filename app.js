const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

// Documentation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./openapi.yml');

// Validation
const { body } = require('express-validator');

// Security
require('./db_init');
require('./passport_init');
const JwtFilter = require('./auth/JwtFilter');
const AnonymousCredentialProvider = require('./auth/AnonymousCredentialProvider');

const UserController = require('./controllers/UserController');
const LoginController = require('./controllers/LoginController');

const BranchController = require('./controllers/BranchController');
const LessonController = require('./controllers/LessonController');
const LessonSpecController = require('./controllers/LessonSpecController');

const RefreshController = require('./controllers/RefreshController');
const GlobalErrorHandler = require('./middlewares/GlobalErrorHandler');
const validationResultHandler = require('./middlewares/ExpressValidatorErrorHandler');

const app = express();

app.use(logger('dev'));
app.use(express.json()); // body-parser가 express로 merge됨.
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(JwtFilter);
app.use(AnonymousCredentialProvider);

const emailValidator = [body('email').isEmail().withMessage('bad format')];

app.use('/users', emailValidator, validationResultHandler, UserController);

app.use('/login', emailValidator, validationResultHandler, LoginController);

app.use('/branches', BranchController);

app.use('/lessons', LessonController);

app.use('/lesson_specs', LessonSpecController);

app.use('/refresh', RefreshController);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

app.use(GlobalErrorHandler);

module.exports = app;
