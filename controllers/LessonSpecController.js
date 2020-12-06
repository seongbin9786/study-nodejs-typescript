const express = require('express');
const debug = require('debug')('app:lesson_spec');
const asyncHandler = require('express-async-handler');
const HttpStatusCodes = require('../constants/HttpStatusCodes');

const router = express.Router();
const LessonSpecRepository = require('../repositories/LessonSpecRepository');

const NOT_FOUND = '존재하지 않는 수업 정의입니다.';

// 일단 임시로 이렇게
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { branchId, from, to } = req.query;
    debug('branch Id Detected!');
    const queryObj = {};
    if (branchId) queryObj.branch = branchId;
    if (from || to) {
      queryObj.beginAt = {};
      if (from) queryObj.beginAt.$gte = new Date(from);
      if (to) queryObj.beginAt.$lt = new Date(to);
    }
    const lessonSpecs = await LessonSpecRepository.findLessonSpecList(queryObj);
    return res.json(lessonSpecs);
  }),
);

// id가 없는 case는 이 라우팅을 안 타므로 처리하지 않아도 됨
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const lessonSpec = await LessonSpecRepository.findLessonSpecById(req.params.id);
    res.json(lessonSpec);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    debug('before LessonSpec Creation');

    const saved = await LessonSpecRepository.createLessonSpec(req.body);
    res.status(HttpStatusCodes.CREATED).json(saved);
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const removed = await LessonSpecRepository.deleteLessonSpecById(req.params.id);
    if (!removed) return res.status(HttpStatusCodes.NOT_FOUND).send(NOT_FOUND);
    res.status(HttpStatusCodes.OK).send();
  }),
);

module.exports = router;
