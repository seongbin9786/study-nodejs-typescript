const mongoose = require('mongoose');
const User = require('../models/User');
const ModelValidationError = require('../errors/ModelValidationError');

/*
  @returns: <Promise> or "duplicate" String
*/
async function registerUser(user) {
  try {
    // 중복 체크 정도면 선언적으로 처리하지 않아도 될 것 같다.
    const found = await User.findOne({ email: user.email });
    if (found) return 'duplicate';

    const newUser = new User(user);
    // await을 여기서 걸고 return 하면 이 try-catch가 걸리고,
    // 그냥 Promise를 return 하면 호출한 함수의 try-catch가 걸린다.
    const saved = await newUser.save();
    return saved;
  } catch (e) {
    // MongooseValidationError -> ModelValidationError
    if (e instanceof mongoose.Error.ValidationError) {
      throw new ModelValidationError(e);
    }
    throw e;
  }
}

/*
    @returns: <Promise> 유저 객체 배열 - 없을 경우 빈 배열
*/
async function findUserList() {
  return User.find();
}

/*
    @returns: <Promise> 유저 객체 - 없을 경우 null
*/
async function findUserById(id) {
  return User.findById(id);
}

/*
    @returns: <Promise> User | null
*/
async function patchUser(id, params) {
  try {
    // _id, email, salt, deleted 는 반영하지 않음.
    const { _id, email, salt, deleted, ...content } = params;
    // 계정이 없을 수 있으니 체크
    const n = await User.count({ _id: id });
    if (n === 0) return null;

    const updated = await User.findOneAndUpdate(
      { _id: id },
      // $set으로 이렇게 한 방에 가능하니 너무 좋다.
      { $set: content },
      // new 옵션을 주면 doc으로 알아서 find해서 반환
      { runValidators: true, new: true },
    );
    return updated;
  } catch (e) {
    // MongooseValidationError -> ModelValidationError
    if (e instanceof mongoose.Error.ValidationError) {
      throw new ModelValidationError(e);
    }
    throw e;
  }
}

/*
    @returns: <Promise> 유저 제거 여부 Boolean
*/
async function deleteUserById(id) {
  const result = await User.delete({ _id: id, deleted: { $ne: true } });
  return result.nModified !== 0;
}

module.exports = {
  registerUser,
  findUserList,
  findUserById,
  patchUser,
  deleteUserById,
};
