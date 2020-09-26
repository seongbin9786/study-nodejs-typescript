const express = require('express');
const debug = require('debug')('app:users');

const router = express.Router();
const User = require('../models/User');

const NOT_FOUND = '존재하지 않는 계정입니다.';
const FORBIDDEN = '권한이 부족합니다.';

router.get('/', (req, res) => {
  if (!req.user.checkPermission('관리자')) {
    return res.status(403).send(FORBIDDEN);
  }
  User.find({}, (_, userList) => {
    res.json(userList);
  });
});

router.get('/:id', (req, res) => {
  if (!req.user.checkPermission('관리자')) {
    return res.status(403).send(FORBIDDEN);
  }
  User.findById(req.params.id, (_, user) => {
    if (!user) return res.status(404).send(NOT_FOUND);
    res.json(user);
  });
});

router.patch('/:id', (req, res) => {
  const tryRoleElevation = Boolean(req.body.role);
  const isAdmin = req.user.checkPermission('관리자');
  const isNotSelf = req.user.id !== req.params.id;

  if ((tryRoleElevation || isNotSelf) && !isAdmin) {
    return res.status(403).send(FORBIDDEN);
  }
  // TODO: doc update: 이메일에 관해 중복 여부를 체크하기보다 변경 불가능하게 만들기.
  const { id: _id, email, ...content } = req.body;
  User.findOneAndUpdate({ _id }, { $set: content }, // $set으로 이렇게 한 방에 가능하니 너무 좋다.
    { runValidators: true, new: true }, (err, result) => {
      if (err) {
        debug('Error while patching: %o', err);
        return res.status(500).send(`서버 오류가 발생했습니다: ${err.message}`);
      }
      if (!result) {
        return res.status(404).send(NOT_FOUND);
      }
      debug('PATCH result: %o', result);
      res.json(result);
    });
});

router.delete('/:id', (req, res) => {
  User.deleteById(req.params.id, (_, result) => {
    if (result.nModified === 0) {
      return res.status(404).send(NOT_FOUND);
    }
    debug('deleted: %o', result);
    res.status(200).send();
  });
});

module.exports = router;
