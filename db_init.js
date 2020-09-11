var debug = require('debug')('app:db');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/studynodets', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', debug);

db.once('open', () => debug('Database connected.'));
