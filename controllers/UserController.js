const express = require('express');
const debug = require('debug')('app:users');

const router = express.Router();

const UserRepository = require('../repositories/UserRepository');
const JwtPublish = require('../auth/JwtPublish');
const ModelValidationError = require('../errors/ModelValidationError');
const HttpStatusCodes = require('../constants/HttpStatusCodes');

const NOT_FOUND = '존재하지 않는 계정입니다.';
const FORBIDDEN = '권한이 부족합니다.';

router.get('/', async (req, res) => {
  if (!req.user.checkPermission('관리자')) {
    return res.status(403).send(FORBIDDEN);
  }
  const users = await UserRepository.findUserList();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  // 본인 건 조회 가능하게
  if (req.user.id === req.params.id || !req.user.checkPermission('관리자')) {
    return res.status(403).send(FORBIDDEN);
  }
  const user = await UserRepository.findUserById(req.params.id);
  if (!user) return res.status(404).send(NOT_FOUND);

  res.json(user);
});

router.post('/', async (req, res) => {
  try {
    debug('body: %o', req.body);
    debug('user: %o', req.user);
    // 가입 시 role을 지정하는 경우, 관리자만 가능함.
    if (req.body.role && !req.user.checkPermission('관리자')) {
      return res.status(HttpStatusCodes.FORBIDDEN).send('권한이 부족합니다.');
    }
    const newUser = await UserRepository.registerUser(req.body);
    if (newUser === 'duplicate') {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ email: 'duplicate' });
    }
    debug('newUser: %o', newUser);
    const { id, email, name } = newUser;
    res.status(HttpStatusCodes.CREATED).json({
      id,
      email,
      name,
      token: JwtPublish({ id }, false),
    });
  } catch (e) {
    if (e instanceof ModelValidationError) {
      res.status(HttpStatusCodes.BAD_REQUEST).json(e.message);
    }
    throw e;
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const tryRoleElevation = Boolean(req.body.role);
  const isAdmin = req.user.checkPermission('관리자');
  const isNotSelf = req.user.id !== req.params.id;

  if (tryRoleElevation && (isNotSelf || !isAdmin)) {
    return res.status(HttpStatusCodes.FORBIDDEN).send(FORBIDDEN);
  }
  try {
    const user = await UserRepository.patchUser(id, req.params);
    res.json(user);
  } catch (e) {
    if (e instanceof ModelValidationError) {
      res.status(HttpStatusCodes.BAD_REQUEST).json(e.message);
    }
    throw e;
  }
});

router.delete('/:id', async (req, res) => {
  const removed = await UserRepository.deleteUserById(req.params.id);
  if (!removed) return res.status(HttpStatusCodes.NOT_FOUND).send(NOT_FOUND);
  res.status(HttpStatusCodes.OK).send();
});

module.exports = router;
