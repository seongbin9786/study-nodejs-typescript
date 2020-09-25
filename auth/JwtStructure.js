/*
    {
        id: MongoDbId
        iat: [current]
        exp: [5m | 30m]
    }
*/
module.exports = {
  JwtResolveId: (payload) => payload.id,
  JwtStoreId: ({ id }) => ({ id }),
};
