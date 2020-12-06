const LOWEST_LV = 0;

const list = {
  완료: LOWEST_LV,
  휴강: LOWEST_LV + 1,
  취소: LOWEST_LV + 2,
};

const getLowestType = () => Object.keys(list).find(k => list[k] === LOWEST_LV);

// prev가 없으면 ,를 넣으면 이상한 문자열이 된다.
// 출력:  "수업 상태는 완료, 휴강, 취소 3개입니다."
const ValidationMsg = `수업 상태는 ${Object.keys(list).reduce((prev, cur) => (!prev ? cur : `${prev}, ${cur}`), '')} ${
  Object.keys(list).length
}개입니다.`;

module.exports = {
  list,
  getLowestType,
  ValidationMsg,
};
