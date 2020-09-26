/*
    {
        id: MongoDbId
        iat: [current]
        exp: [5m | 30m]
        role: ['일반회원','관리자'] // 추후 암호화해야.
    }
*/
module.exports = {
  ExtractJwtContent: (payload) => ({ id: payload.id, role: payload.role }),
  JwtStoreContent: ({ id, role }) => ({ id, role }),
};
