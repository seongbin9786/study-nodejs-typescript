const debug = require('debug')('app:attendance');

const Attendance = require('../models/Attendance');
const LessonRepository = require('./LessonRepository');

/*
  내가 수강했던 강의,
  수강 신청된 강의

  목록을 보여주기 위한 질의이다.

  ---
  validation:
  [1] userId: 할 필요 없음
  [2] closed: 할 필요 없음 (truthy, falsy로 체크되기 때문)
*/
async function findLessonsUserAttended(userId, closed) {
  try {
    // Attendance 같은 경우는 mongoose model을 안 통하고 query 하는 게 좋을 것 같은데 그럴 순 없나?
    // 가능하다.
    /*
      TODOLIST
      --------
      [1] mongoClient 사용법 알아내기
      [2]

      그냥 몽구스로 하는게 역시 빠른 것 같다.
      다만 Attendance 특성상 그냥 몽고로 바로 가는게 가볍고 그래서 그런건데 흠..
      일단 몽구스로 해결해보고 보자.
    */
    // 뭐 잘 될 것이다. 이 정도 복잡성은...
    const idArray = await Attendance.find({ user: userId })
      .select('-_id -user')
      .exec()
      .then(list => list.map(({ lesson }) => lesson));

    return LessonRepository.findAllLessonsByIdList(idArray, closed);
  } catch (e) {
    debug('findLessonsUserAttended Error: %o', e);
    return [];
  }
}

module.exports = {
  findLessonsUserAttended,
};
