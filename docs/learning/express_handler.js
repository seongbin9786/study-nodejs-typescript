// 1. Router 객체 얻어오기
const express = require('express');

const router = express.Router();

/*
2. router 객체에 상대주소로 핸들러 등록하기

3. res 객체로 응답 제출하기
- 쓸 게 크게 status와 json밖에 없다.
- 타 메서드는 헤더 설정, 파일 전송 등의 기능이 있다.

*/
router.get('/', (req, res, next) => {
  res.json({
    name: 'test',
  });
});

module.exports = router;
