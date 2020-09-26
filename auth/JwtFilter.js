const passport = require('passport');

// passport-anonymous도 추가했는데,
// /register 등의 엔드포인트에서 회원일 때와 비회원일 때가 동시에 필요한데,
// passport-jwt는 토큰이 없으면 무조건 401을 띄워버려서
// passport-anonymous로 fallback을 하고,
// 그 후 AnonymousCredentialProvider를 태워 비회원 계정 객체를 제공한다.
module.exports = passport.authenticate(['jwt', 'anonymous'], { session: false });
