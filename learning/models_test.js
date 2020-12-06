const mongoose = require('mongoose');
const debug = require('debug')('learning:models');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, '이름은 필수 입력입니다.'],
  },
  falsy: Number,
}); // 일반 모델에서도 _id가 없어도 되는지 궁금함

// works
UserSchema.methods.getTool = function (tool) {
  tool.kick();
  if (tool.kick) {
    debug(tool.kick.toString());
  }
  return tool;
};

const User = mongoose.model('User', UserSchema);

const ToolSchema = new Schema({
  name: {
    type: String,
    required: [true, '이름은 필수 입력입니다.'],
  },
  test: {
    type: String,
    enum: {
      values: ['hi', 'hello'],
      message: 'you fucking disobey the rule!!',
    },
  },
});

ToolSchema.methods.kick = function () {
  debug('hello, world!');
};

const Tool = mongoose.model('Tool', ToolSchema);

const user = new User({
  name: 'Seongbin Kim',
});

const tool = new Tool({
  name: 'Savages',
});

async function patchUser(id, params) {
  try {
    const { _id, email, salt, deleted, ...content } = params;
    // 계정이 없을 수 있으니 체크
    const n = await User.count({ _id: id }, (_, _n) => _n);
    if (n === 0) return null;

    // async callback을 제공 안 하는건가.. 왜 이렇게 더럽게 해야 되는지 모르겠다.
    return await User.findOneAndUpdate(
      { _id: id },
      { $set: content },
      // $set으로 이렇게 한 방에 가능하니 너무 좋다.
      { runValidators: true, new: true },
      // new 옵션을 주면 doc으로 알아서 find해서 반환
    );
  } catch (e) {
    debug('patchUser: %o', e);
  }
}

(async function () {
  // save하지 않아도 methods는 생김. 당연한 얘기겠지만.
  await user.save();
  await tool.save();
  //  const users = await awaitFind();

  const falsyUser = new User({
    name: 'hey', // Boolean('') === false
    falsy: 0,
  });
  await falsyUser.save();
  // falsy: 0도 select가 된다.
  const findFalsyTest = await User.find({ falsy: { $ne: true } });
  debug(findFalsyTest);
  //  debug('users: %o', users);

  // patch 테스트
  // 이젠 삭제돼서 의미가 없음.
  const patched = await patchUser('5fc2d122010cfc093b988b0a', { name: 'Patched' });
  debug('patched: %o', patched); // worked

  const removed = await User.deleteOne({ _id: '5fc2d122010cfc093b988b0a' });
  debug('removed: %o', removed);

  // retunrs <null> 이런거 문서화좀 제발 했으면.
  const found = await User.findById('5fc2d122010cfc093b988b0a');
  debug('found: %o', found);
})();

debug('user: %o', user);
debug('user: %o', user.getTool.toString());
debug('getTool: %o', user.getTool(tool));
