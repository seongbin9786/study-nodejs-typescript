const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수 입력입니다.'],
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수 입력입니다.'],
  },
  name: {
    type: String,
    required: [true, '이름은 필수 입력입니다.'],
  },
});

module.exports = mongoose.model('User', UserSchema);
