const debug = require('debug')('app:db');

/* [begin] Mongoose Setup */
const mongoose = require('mongoose');

const CONNECTION_STRING = 'mongodb://localhost/studynodets';

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

// https://stackoverflow.com/questions/18762264/log-all-queries-that-mongoose-fire-in-the-application
mongoose.set('debug', true);

db.on('error', debug);

db.once('open', () => debug('Database connected.'));

/* [end] Mongoose Setup */
