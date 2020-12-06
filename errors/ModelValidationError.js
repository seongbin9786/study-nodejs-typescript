// Mongoose.ValidationError의 추상화
// Mongo에서 다른걸 써도 똑같이 JSON으로 출력반환
class ModelValidationError extends Error {
  constructor(mongooseError) {
    super();
    this.message = Object.values(mongooseError.errors).reduce((acc, e) => {
      acc[e.path] = e.kind;
      return acc;
    }, {});
  }
}

module.exports = ModelValidationError;
