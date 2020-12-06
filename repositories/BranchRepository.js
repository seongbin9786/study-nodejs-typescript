const mongoose = require('mongoose');
const ModelValidationError = require('../errors/ModelValidationError');
const Branch = require('../models/Branch');

async function createBranch(branch) {
  const toCreate = new Branch(branch);

  try {
    return await toCreate.save();
  } catch (e) {
    // MongooseValidationError -> ModelValidationError
    if (e instanceof mongoose.Error.ValidationError) {
      throw new ModelValidationError(e);
    }
    throw e;
  }
}

/*
    @returns: <Promise> 지점 객체 배열 - 없을 경우 빈 배열
*/
async function findBranchList() {
  return Branch.find();
}

/*
    @returns: <Promise> 지점 객체 - 없을 경우 null
*/
async function findBranchById(id) {
  return Branch.findById(id);
}

/*
    @returns: <Promise> User | null
*/
async function patchBranch(id, params) {
  try {
    const { _id, deleted, ...content } = params;
    const n = await Branch.count({ _id: id });
    if (n === 0) return null;

    return Branch.findOneAndUpdate(
      { _id: id },
      // $set으로 이렇게 한 방에 가능하니 너무 좋다.
      { $set: content },
      // new 옵션을 주면 doc으로 알아서 find해서 반환
      { runValidators: true, new: true },
    );
  } catch (e) {
    // MongooseValidationError -> ModelValidationError
    if (e instanceof mongoose.Error.ValidationError) {
      throw new ModelValidationError(e);
    }
    throw e;
  }
}

/*
    @returns: <Promise> 지점 제거 여부 Boolean
*/
async function deleteBranchById(id) {
  const result = await Branch.delete({ _id: id, deleted: { $ne: true } });
  return result.nModified !== 0;
}

module.exports = {
  createBranch,
  findBranchList,
  findBranchById,
  patchBranch,
  deleteBranchById,
};
