const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:users');

const router = express.Router();
const User = require('../models/User');

const validationFormatter = require('./validationErrorFormatter');

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
  const { id } = req.params;
  const tryRoleElevation = Boolean(req.body.role);
  const isAdmin = req.user.checkPermission('관리자');
  const isNotSelf = req.user.id !== req.params.id;

  if (tryRoleElevation && (isNotSelf || !isAdmin)) {
    return res.status(403).send(FORBIDDEN);
  }
  // salt, deleted도 제외해야 할 듯
  const {
    _id, email, salt, deleted, ...content
  } = req.body;
  User.count({ _id: id }, (_, n) => {
    debug(n);
    if (n === 0) {
      return res.status(404).send(NOT_FOUND);
    }
  });
  User.findOneAndUpdate(
    { id },
    { $set: content }, // $set으로 이렇게 한 방에 가능하니 너무 좋다.
    { runValidators: true, new: true },
    (err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        const msgs = validationFormatter(err);
        return res.status(400).json(msgs);
      }
      if (err) {
        debug('Error while patching: %o', err);
        return res.status(500).send(`서버 오류가 발생했습니다: ${err.message}`);
      }
      // mongoose-deleted가 바보같이 deleted를 넣어서 여기서도 빼줘야 함.
      User.findById(req.params.id, '-deleted', (_, updated) => res.json(updated));
    },
  );
});

router.delete('/:id', (req, res) => {
  // mongoose-delete에서 제공하는 누가 삭제했는지 표시하는 기능:
  // 사용하려면 참고:https://github.com/dsanel/mongoose-delete#who-has-deleted-the-data
  User.deleteById(req.params.id, (_, result) => {
    if (result.nModified === 0) {
      return res.status(404).send(NOT_FOUND);
    }
    debug('deleted: %o', result);
    res.status(200).send();
  });
});

module.exports = router;
