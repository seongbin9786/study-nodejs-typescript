var mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: String,
    password: String,
    name: String
});

module.exports = mongoose.model('User', UserSchema);
