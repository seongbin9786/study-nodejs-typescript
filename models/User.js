const crypto = require('crypto');
const mongoose = require('mongoose');
const mongooseDeletePlugin = require('mongoose-delete');
const debug = require('debug')('app:userModel');

const RoleDefinitions = require('../auth/RoleDefinitions');

const Voucher = require('./Voucher');
const VoucherTypes = require('./VoucherTypes');

const { Schema } = mongoose;

const CommonOpts = require('./_common_opts');

// required: validated at save
// required 이외의 validation은 어떻게 하는가?
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, '이메일은 필수 입력입니다.'],
      unique: true,
      match: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
      required: [true, '비밀번호는 필수 입력입니다.'],
      // 8자 이상의 대소문자, 특수문자 포함
      // 참고: https://stackoverflow.com/questions/58767980/aws-cognito-password-regex
      match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\^$*.[\]{}()?\-“!@#%&/,><’:;|_~`])\S{8,99}$/,
      msg: 'password',
      select: false,
    },
    salt: {
      type: String,
      select: false, // 의도적으로 select 옵션을 주지 않으면 쿼리되지 않음.
    },
    name: {
      type: String,
      required: [true, '이름은 필수 입력입니다.'],
      minlength: 2,
    },
    mobile: {
      type: String,
      required: [true, '전화번호는 필수 입력입니다.'],
      // 참고: https://epthffh.tistory.com/entry/%EB%B9%84%EB%B0%80%EB%B2%88%ED%98%B8-%EC%A0%95%EA%B7%9C%EC%8B%9D
      match: /^\d{3}-\d{3,4}-\d{4}$/,
    },
    address: {
      type: String,
      // 정확한 주소가 아니라, 시군구 정도만 간략하게 파악.
      required: [true, '주소는 필수 입력입니다.'],
    },
    role: {
      type: String,
      default: '일반회원',
    },
    // Voucher가 애매하다. 하나의 바우처만을 다룰 수 있게 해야 하는지 말아야 하는지 모르겠음(...)
    // 바우처를 통합하자.
    voucher: {
      type: Voucher, // mongoose.model()로 컴파일된 '모델은' '셰마'가 아니므로 허용되지 않음.
      /*
    너무 신기한 점 발견:
    [1] voucher 필드는 DB에 이미 데이터가 있는 상태에서 추가한 필드임
    [2] Mongoose에서 Access할 때 Mongodb의 기존 데이터는 아예 voucher필드가 없지만
      출력 시 null로 필드가 초기화되어나와있음. 이런 부분이 좀 문서화가 돼있으면 좋을텐데 아쉽다.
      좀 되면 되는대로 하자 하는 Hack 느낌 그냥 프로토타입 느낌이 많이 난다. 큰 컨셉이 좀 없는 것 같다. ('대충'이 컨셉이면 맞긴 하다...)
    */
      default: null,
    },
  },
  CommonOpts,
);

// [js] arrow function을 쓰면 this가 없다. Why?
// [mongoose] 그리고 save 에 pre를 걸면 update 때는 의미가 없다. / 이게 findAndUpdate를 써야 됐나?
// eslint-disable-next-line func-names
UserSchema.pre('save', function () {
  debug(this);
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 256, 'sha256').toString('hex');
});

// eslint-disable-next-line func-names
UserSchema.methods.comparePassword = function (password) {
  const hashedInput = crypto.pbkdf2Sync(password, this.salt, 10000, 256, 'sha256').toString('hex');
  return this.password === hashedInput;
};

// eslint-disable-next-line func-names
UserSchema.methods.checkPermission = function (necessary) {
  const myLv = RoleDefinitions[this.role];
  const reqLv = RoleDefinitions[necessary];
  debug('[checkPermission] My: %o[lv.%o], Required: %o[lv.%o]', this.role, myLv, necessary, reqLv);
  return myLv >= reqLv;
};

// eslint-disable-next-line func-names
UserSchema.methods.compareVoucher = function (required) {
  if (!this.voucher) {
    // in case of null
    return -1;
  }
  const myVchr = VoucherTypes[this.voucher.name];
  const reqVchr = VoucherTypes[required];
  debug('[compareVoucher] My: [%o], Required: [%o]', this.role, myVchr, required);
  return myVchr - reqVchr;
};

// overrideMethods: find 등의 mongoose api를 덮어쓴다.
// validate를 delete 시에 작동시킬 것인가? NO.
UserSchema.plugin(mongooseDeletePlugin, { overrideMethods: true, validateBeforeDelete: false });

module.exports = mongoose.model('User', UserSchema);
