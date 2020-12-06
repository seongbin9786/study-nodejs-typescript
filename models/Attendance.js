const mongoose = require('mongoose');
const CommonOpts = require('./_common_opts');

const { Schema } = mongoose;

/*
    삭제될 일 없으므로 mongoose-delete 사용하지 않음.
*/
const AttendanceSchema = new Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, '사용자 ID는 필수 입력입니다.'],
    },
    lesson: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Lesson',
      required: [true, '강의 ID는 필수 입력입니다.'],
    },
    loggedAt: {
      type: Date,
    },
  },
  CommonOpts,
);

module.exports = mongoose.model('Attendance', AttendanceSchema);
