module.exports = (err, req, res, next) => {
  if (res.headersSent) { return next(err); }
  res.status(500).send('서버 오류가 발생했습니다.');
};
