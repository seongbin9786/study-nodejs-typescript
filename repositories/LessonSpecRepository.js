const mongoose = require('mongoose');
const ModelValidationError = require('../errors/ModelValidationError');

const LessonSpec = require('../models/LessonSpec');

/*
    @returns: <Promise> 지점 객체 - 없을 경우 null
*/
async function findLessonSpecById(id) {
  return LessonSpec.findById(id);
}

/*
    @returns: <Promise> 지점 객체 - 없을 경우 null
*/
async function findLessonSpecList(queryObj) {
  return LessonSpec.find(queryObj);
}

async function createLessonSpec(lesson) {
  const toCreate = new LessonSpec(lesson);
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
    @returns: <Promise> User | null
*/
async function patchLessonSpec(id, params) {
  try {
    // 이 경로로는 참가 인원은 변경할 수 없음.
    const { _id, deleted, ...content } = params;
    const n = await LessonSpec.count({ _id: id });
    if (n === 0) return null;

    return LessonSpec.findOneAndUpdate(
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
async function deleteLessonSpecById(id) {
  const result = await LessonSpec.delete({ _id: id, deleted: { $ne: true } });
  return result.nModified !== 0;
}

module.exports = {
  createLessonSpec,
  findLessonSpecById,
  findLessonSpecList,
  patchLessonSpec,
  deleteLessonSpecById,
};
