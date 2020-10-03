module.exports = function validate(err) {
  const errors = Object.values(err.errors);
  return errors.reduce((acc, e) => {
    acc[e.path] = e.kind;
    return acc;
  }, {});
};
