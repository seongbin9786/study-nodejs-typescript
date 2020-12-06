/*
    {
        id: ObjectId(HexString)
        iat: [current]
        exp: [5m | 30m]
          - refresh 할 때마다 아이디 정보를 갱신해야 함 - 즉 5분마다 아이디 정보가 갱신됨
          
        role: ['일반회원','관리자'] // 추후 암호화해야.
    }
*/
module.exports = {
  ExtractJwtContent: payload => ({
    id: payload.id,
    role: payload.role,
    voucher: payload.voucher,
  }),
  // voucher: null이 기본이므로 null 처리해주어야 함.
  JwtStoreContent: ({ id, role, voucher }) => ({ id, role, voucher }),
};
