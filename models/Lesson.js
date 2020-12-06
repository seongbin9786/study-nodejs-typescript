const mongoose = require('mongoose');
const mongooseDeletePlugin = require('mongoose-delete');
const LessonCloseTypes = require('./LessonCloseTypes');
const VoucherTypes = require('./VoucherTypes');

const { Schema } = mongoose;

const CommonOpts = require('./_common_opts');

// 별로 필요가 없는 것 같다.
const LessonSchema = new Schema(
  {
    // 정말 필요할 때 populate하도록.
    spec: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'LessonSpec',
      required: [true, '강의 ID는 필수 입력입니다.'],
    },
    // 지점별로 Filter할 때 사용
    branch: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Branch',
      required: [true, '지점 ID는 필수입력입니다.'],
    },
    // lesson명 (복사)
    name: {
      type: String,
      required: [true, '레슨명은 필수 입력입니다.'],
    },
    // 시간대 (복사)
    beginAt: {
      type: Date,
      required: [true, '시작 시각은 필수 입력입니다.'],
    },
    duration: {
      type: Number,
      required: [true, '진행 시간은 필수 입력입니다.'],
    },
    // 이건 필요한게, 수강생 총 종원으로 수강신청은 Block해야하기 때문이다.
    // 이렇게 블락이 되는진 잘 모르겠음. Lock이 제대로 필요할 것 같기도 함(DB 공부 필요).
    participantsList: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
      },
    ],
    // length는 서버단에서 자동 생성할 예정. required 의미 없음.
    curParticipants: {
      type: Number,
      default: 0,
    },
    // 복사
    maxParticipants: {
      type: Number,
      required: [true, '최대수강인원수는 필수 입력입니다.'],
    },

    // 취소된 수업인지 여부 (코로나 방역 등으로 인해)
    // 별 일 없으면 상관 없음
    closed: {
      type: String,
      enum: {
        values: Object.keys(LessonCloseTypes.list),
        message: LessonCloseTypes.ValidationMsg,
      },
      // enum의 경우 default 값을 주더라도 불가능함
      // default: null
      // 대신 필드에 아예 값을 주지 않으면 됨 ^^
      // 따라서 falsy 값으로 closed 여부를 체크할 수 있음.
      // undefined: 미수강
      // 0: 완료(정상)
    },
    voucher: {
      type: String,
      enum: {
        values: Object.keys(VoucherTypes.list),
        message: VoucherTypes.ValidationMsg,
      },
      required: [true, '수강권 타입은 필수 입력입니다.'],
    },
  },
  CommonOpts,
);

/*
  @returns Error - if not worked.
*/
LessonSchema.methods.addStudentToList = function (student) {
  if (student.compareVoucher(this.voucher) < 0) {
    throw new Error('수강권 레벨이 낮습니다.');
  }
  if (this.curParticipants >= this.maxParticipants) {
    throw new Error('수업 정원이 꽉 찼습니다.');
  }
  // id 배열이므로 id로 비교해야 됨
  if (this.participantsList.includes(student.id)) {
    throw new Error('이미 신청된 수업입니다.');
  }
  // id getter
  this.participantsList.push(student.id);
  // 왜 ++이 안티 패턴인지 모르겠다.
  this.curParticipants += 1;
};

/*
  @returns Error - if not worked.
*/
LessonSchema.methods.removeStudentFromList = function (student) {
  if (!this.participantsList.includes(student.id)) {
    throw new Error('신청하지 않은 수업입니다.');
  }
  // MongooseArray pull
  // Mongoose: lessons.update( { ...}, { $pullAll: { participantList: [ ObjectId("~~") ] } });
  this.participantsList.pull({ _id: student.id });
  this.curParticipants -= 1;
};

LessonSchema.plugin(mongooseDeletePlugin, {
  overrideMethods: true,
  validateBeforeDelete: false,
});

module.exports = mongoose.model('Lesson', LessonSchema);
