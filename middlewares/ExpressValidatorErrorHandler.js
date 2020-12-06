const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    // HttpStatusCode enum으로 쓰자.
    const code = 400;
    const json = Object.values(error.errors).reduce((acc, e) => {
      acc[e.param] = e.msg;
      return acc;
    }, {});
    return res.status(code).json(json);
  }
  next();
};
