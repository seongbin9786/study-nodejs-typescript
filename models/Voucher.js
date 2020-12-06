const mongoose = require('mongoose');
const debug = require('debug')('app:VoucherModel');

const VoucherTypes = require('./VoucherTypes');

const { Schema } = mongoose;

/*
  Voucher는 따로 모델이 없는 셈이므로,
  VoucherService 등을 만들어 로그 생성 등의
  static한 기능을 제공해야 할 것으로 보임 (logging 포함)
*/
// 바우처 모델이 문제다. 그냥 Mongoose와 전혀 관련 없는 class를 하나 만들어야 할 듯.
// 유저에게 종속되는 데이터를 표현함.
// Admin 입장에선 수강권 종류와 남은 기간만이 중요하므로 새로운 형태의 DTO를 만들면 될 듯 (DB에는 이렇게 저장하고.)
const VoucherSchema = new Schema({
  name: {
    type: String,
    enum: {
      values: Object.keys(VoucherTypes.list),
      message: VoucherTypes.ValidationMsg,
    },
    required: [true, '수강권 타입은 필수 입력입니다.'],
  },
  duration: {
    type: Number,
    required: [true, '지속일은 필수 입력입니다.'],
  },
  effective_date: {
    type: Date,
    required: [true, '수강 시작일은 필수 입력입니다.'],
  },
  expires_at: {
    type: Date,
    required: [true, '수강 종료일은 필수 입력입니다.'],
  },
});
// 일반 모델에서도 _id가 없어도 되는지 궁금함 - save만 안 됨, 생성자는 활용 가능함.
// 그러나 methods가 없기 때문에 사실상 아무 의미 없는게 아닌가 싶음.
// 그냥 Voucher 생성자를 쓸 게 아니라 바로 객체로 선언하면 되지 않나?
// 생성자 사용 시 validation이 있는지 확인해보기.

// TODO: 근거가 없음. 문서 어딘가에서 본 것 같은데, 내가 정리한 내용은 아닌듯함.
// Q. populate한 이후에 이 메소드를 포함한 객체가 되는가?
// A. YES(static의 경우 Voucher.XXX로 사용할 수 있을듯).
// 또한 해당 객체는 디비와 동기화되는 메소드를 지원하므로, remove시 정말로 삭제되는 등의 효과도 있음

// Q. populate를 한 이후엔 그냥 JSON 형태 그대로의 값 객체인가?
// A. 아니다. `lean`을 사용하거나, `toObject`를 해야 말이 맞다.

// Q. id로 전달해도 _id로 인식할까?
// A. SELECT 시에는 _id로 하는게 맞음. virtual은 MongoDB에선 전혀 없기 때문임.

// eslint-disable-next-line func-names
VoucherSchema.methods.compareLevel = function (necessary) {
  const myLv = VoucherTypes.list[this.voucher_class];
  const reqLv = VoucherTypes[necessary];
  debug('[Voucher][compareLevel] My: %o[lv.%o], Required: %o[lv.%o]', this.voucher_class, myLv, necessary, reqLv);
  return myLv - reqLv;
};

module.exports = VoucherSchema;
