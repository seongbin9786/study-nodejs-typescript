const debug = require('debug')('app:BranchRepository');

const mongoose = require('mongoose');
const ModelValidationError = require('../errors/ModelValidationError');
const Lesson = require('../models/Lesson');
const LessonSpec = require('../models/LessonSpec');

async function createLesson(lessonInfo) {
  // 이 한 줄 때문에 Joi로 셰마 구성을 하는 등의 번잡한 방식은 효율이 떨어진다.
  // 반환할 객체가 없다.
  if (!lessonInfo || !lessonInfo.id) {
    debug('createLesson Error: no lessonInfo or id');
    throw new Error('createLesson Error: no lessonInfo or id');
  }
  try {
    const spec = await LessonSpec.findById(lessonInfo.id);
    const lesson = spec.createLesson(lessonInfo);
    debug('createLesson[before save]: %o', lesson);
    return lesson.save();
  } catch (e) {
    // MongooseValidationError -> ModelValidationError
    if (e instanceof mongoose.Error.ValidationError) {
      throw new ModelValidationError(e);
    }
    throw e;
  }
}

async function findLessonById(id) {
  const found = await Lesson.findById(id).populate('participantsList', 'name');
  return found;
}

async function findLessonList(args) {
  return Lesson.find(args);
}

async function registerToLesson(lessonId, student) {
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw new Error('Lesson Not Found');

    lesson.addStudentToList(student);

    debug(lesson);

    await lesson.save();
  } catch (e) {
    debug(e);
    throw e;
  }
}

async function removeFromLesson(lessonId, student) {
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw new Error('Lesson Not Found');

    lesson.removeStudentFromList(student);

    debug(lesson);

    await lesson.save();
  } catch (e) {
    debug(e);
    throw e;
  }
}

/*
    @returns: <Promise> User | null
*/
async function patchLesson(id, params) {
  try {
    // 이 경로로는 참가 인원은 변경할 수 없음.
    const { _id, deleted, spec, participantsList, curParticipants, ...content } = params;
    // 계정이 없을 수 있으니 체크
    const n = await Lesson.count({ _id: id });
    if (n === 0) return null;

    return Lesson.findOneAndUpdate(
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
async function deleteLessonById(id) {
  const result = await Lesson.delete({ _id: id, deleted: { $ne: true } });
  return result.nModified !== 0;
}

module.exports = {
  createLesson,
  findLessonById,
  findLessonList,
  registerToLesson,
  removeFromLesson,
  patchLesson,
  deleteLessonById,
};
