const crypto = require('crypto');
const mongoose = require('mongoose');
const mongooseDeletePlugin = require('mongoose-delete');
const debug = require('debug')('app:userModel');

const RoleDefinitions = require('../auth/RoleDefinitions');

const { Schema } = mongoose;

const AliasIdConfig = {
  virtuals: true,
  transform(_, ret) {
    // eslint-disable-next-line
    delete ret._id;
    return ret;
  },
};

// required: validated at save
// required 이외의 validation은 어떻게 하는가?
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, '이메일은 필수 입력입니다.'],
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수 입력입니다.'],
    select: false,
  },
  salt: {
    type: String,
    select: false, // 의도적으로 select 옵션을 주지 않으면 쿼리되지 않음.
  },
  name: {
    type: String,
    required: [true, '이름은 필수 입력입니다.'],
  },
  mobile: {
    type: String,
    required: [true, '전화번호는 필수 입력입니다.'],
  },
  address: {
    type: String,
    required: [true, '주소는 필수 입력입니다.'],
  },
  role: {
    type: String,
    default: '일반회원',
  },
}, {
  // hide 옵션은 사라져서 사용할 수 없다. 시도도 못해봤다.
  toJSON: AliasIdConfig,
  toObject: AliasIdConfig,
  versionKey: false,
}); // versionKey: __v 제거

// _id 대신 id를 사용할 수 있게 한다.
// eslint-disable-next-line func-names
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// arrow function을 쓰면 this가 없다. Why?
// 그리고 save 에 pre를 걸면 update 때는 의미가 없다.
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

// overrideMethods: find 등의 mongoose api를 덮어쓴다.
// validate를 delete 시에 작동시킬 것인가? NO.
UserSchema.plugin(mongooseDeletePlugin, { overrideMethods: true, validateBeforeDelete: false });

module.exports = mongoose.model('User', UserSchema);
