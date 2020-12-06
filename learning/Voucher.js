const mongoose = require('mongoose');

const VoucherTypes = require('./VoucherTypes');

const { Schema } = mongoose;

const VoucherSchema = new Schema(
  {
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
  },
  { _id: false },
);

module.exports = mongoose.model('Voucher', VoucherSchema);
