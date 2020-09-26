const debug = require('debug')('app:db');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/studynodets', {
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
