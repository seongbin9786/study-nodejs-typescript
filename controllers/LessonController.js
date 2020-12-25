const express = require('express');
const debug = require('debug')('app:lesson');
const asyncHandler = require('express-async-handler');
const HttpStatusCodes = require('../constants/HttpStatusCodes');
const ModelValidationError = require('../errors/ModelValidationError');

const router = express.Router();
const LessonRepository = require('../repositories/LessonRepository');

const NOT_FOUND = '존재하지 않는 수업입니다.';

/*
  출석 체크 용도로 사용
  participantList에서 이름을 populate해서 제공함.
*/
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    debug('on getLessonById');

    const lesson = await LessonRepository.findLessonById(req.params.id);
    res.json(lesson);
  }),
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    debug('on getLessonList');

    // 이것도 나름 중복인데 어떻게 해결할 수 있을지 모르겠음.
    const { branchId, specId, from, to, closed } = req.query;
    const queryObj = {};
    if (branchId) queryObj.branch = branchId;
    if (specId) queryObj.spec = specId;
    if (from || to) {
      queryObj.beginAt = {};
      if (from) queryObj.beginAt.$gte = new Date(from);
      if (to) queryObj.beginAt.$lt = new Date(to);
    }
    if (closed) queryObj.closed = { $ne: closed };
    const lessons = await LessonRepository.findLessonList(queryObj);
    res.json(lessons);
  }),
);

// TODO: register/deregister 예외 case 생각해보고 예외처리하기
router.post(
  '/:id/register',
  asyncHandler(async (req, res) => {
    debug('before Lesson Register');

    await LessonRepository.registerToLesson(req.params.id, req.user);
    res.status(HttpStatusCodes.OK).send();
  }),
);

router.post(
  '/:id/deregister',
  asyncHandler(async (req, res) => {
    debug('before Lesson Deregister');

    await LessonRepository.removeFromLesson(req.params.id, req.user);
    res.status(HttpStatusCodes.OK).send();
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    debug('before Lesson Creation');
    try {
      const lesson = await LessonRepository.createLesson(req.body);
      res.status(HttpStatusCodes.CREATED).json(lesson);
    } catch (e) {
      if (e instanceof ModelValidationError) {
        res.status(HttpStatusCodes.BAD_REQUEST).json(e.message);
      }
      throw e;
    }
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const removed = await LessonRepository.deleteLessonById(req.params.id);
    if (!removed) return res.status(404).send(NOT_FOUND);
    res.status(HttpStatusCodes.OK).send();
  }),
);

module.exports = router;
