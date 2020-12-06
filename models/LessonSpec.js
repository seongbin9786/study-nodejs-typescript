const mongoose = require('mongoose');
const mongooseDeletePlugin = require('mongoose-delete');
const Lesson = require('./Lesson');

const { Schema } = mongoose;

const VoucherTypes = require('./VoucherTypes');
const CommonOpts = require('./_common_opts');

const LessonSpecSchema = new Schema(
  {
    // 애매한게, 여러 수업이 분반 형태로 진행되는 것 같기도 하다. [그냥 레벨로 구분이 된다던가]
    name: {
      type: String,
      required: [true, '강의명은 필수 입력입니다.'],
    },
    // 필요 없을 수 있음
    desc: {
      type: String,
      required: [true, '강의 설명은 필수 입력입니다.'],
    },
    // 강의시간별로 최대수강인원수가 다른건 개발하지 않음.
    maxParticipants: {
      type: Number,
      required: [true, '최대수강인원수는 필수 입력입니다.'],
      min: 0,
    },

    // 시간대
    beginAt: {
      type: Date, // 시작 시간은 Date 타입이다.
      required: [true, '시작 시각은 필수 입력입니다.'],
    },
    duration: {
      type: Number, // 분 단위 진행시간 표시
      required: [true, '진행 시간은 필수 입력입니다.'],
    },
    // 오픈 날짜도 필요한데, 애매하다.

    // 외부 참조 필드
    // 굳이 teacher가 필요한가?
    teacher: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, '강사 ID는 필수 입력입니다.'],
    },
    branch: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Branch',
      required: [true, '지점 ID는 필수입력입니다.'],
    },
    voucher: {
      type: String,
      enum: {
        values: Object.keys(VoucherTypes.list),
        message: VoucherTypes.ValidationMsg,
      },
      required: [true, '수강권 종류는 필수 입력입니다.'],
    },
  },
  CommonOpts,
);

// @returns LessonRoot의 기본값으로 인스턴스 객체를 채워 반환한다.
// eslint-disable-next-line
LessonSpecSchema.methods.createLesson = function (lessonInfo) {
  const { id: spec, branch, name, voucher, maxParticipants, duration } = this;
  return new Lesson({
    spec,
    branch,
    name,
    voucher,
    maxParticipants,
    duration,
    ...lessonInfo,
  });
};

LessonSpecSchema.plugin(mongooseDeletePlugin, {
  overrideMethods: true,
  validateBeforeDelete: false,
});

module.exports = mongoose.model('LessonSpec', LessonSpecSchema);
