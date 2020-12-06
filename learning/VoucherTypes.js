const LOWEST_LV = 0;

const list = {
  취미반: LOWEST_LV,
  전문가반: LOWEST_LV + 1,
};

const getLowestType = () => Object.keys(list).find(k => list[k] === LOWEST_LV);

// prev가 없으면 ,를 넣으면 이상한 문자열이 된다.
// 출력:  "수강권 종류는 취미반, 전문가반 2개입니다."
const ValidationMsg = `수강권 종류는 ${Object.keys(list).reduce(
  (prev, cur) => (!prev ? cur : `${prev}, ${cur}`),
  '',
)} ${Object.keys(list).length}개입니다.`;

module.exports = {
  list,
  getLowestType,
  ValidationMsg,
};

/*
  jsqna.com 을 잘 만들어보자고요.
*/
