const { JWT_ACC_EXP, JWT_RFR_EXP, JWT_SECRET } = process.env;

module.exports = {
  JwtSecret: Buffer.from(JWT_SECRET, 'base64'),
  JwtRefreshTimeout: JWT_RFR_EXP,
  JwtAccessTimeout: JWT_ACC_EXP,
};
