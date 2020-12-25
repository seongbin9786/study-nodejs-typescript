const express = require('express');
const asyncHandler = require('express-async-handler');
const HttpStatusCodes = require('../constants/HttpStatusCodes');
const ModelValidationError = require('../errors/ModelValidationError');

const router = express.Router();
const Branch = require('../models/Branch');

const BranchRepository = require('../repositories/BranchRepository');

const NOT_FOUND = '존재하지 않는 지점입니다.';

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const branches = await BranchRepository.findBranchList();
    res.json(branches);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const branch = await BranchRepository.findBranchById(req.params.id);
    if (!branch) return res.status(HttpStatusCodes.NOT_FOUND).send(NOT_FOUND);

    res.json(branch);
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const branch = new Branch(req.body);

    try {
      const saved = await branch.save();
      res.status(HttpStatusCodes.CREATED).json(saved);
    } catch (e) {
      if (e instanceof ModelValidationError) {
        res.status(HttpStatusCodes.BAD_REQUEST).json(e.message);
      }
      throw e;
    }
  }),
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const user = await BranchRepository.patchBranch(id, req.params);
      res.json(user);
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
    const removed = await BranchRepository.deleteBranchById(req.params.id);
    if (!removed) return res.status(HttpStatusCodes.NOT_FOUND).send(NOT_FOUND);
    res.status(HttpStatusCodes.OK).send();
  }),
);

module.exports = router;
