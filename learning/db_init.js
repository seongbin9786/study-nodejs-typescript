const debug = require('debug')('learning:mongoose');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongoose_playground', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

mongoose.set('debug', true);

db.on('error', debug);

mongoose.connection.on('open', () => {
  debug('Connected to mongodb server.');
});
