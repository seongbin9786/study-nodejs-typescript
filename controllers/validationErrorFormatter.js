module.exports = {
  // key가 (param, msg)이고
  // key가 (path, kind)의 차이일 뿐
  // 이거 중복 제거하면 가독성 낮을 것 같아 그대로 놔둠.
  /*
  문제:
    - 문서화가 안 돼있어서 무슨 입,출력인지 이해하기 어렵다.(2020-12-05)
  */
  /*
  input:
  Result {
    formatter: [Function: formatter],
    errors: [
      {
        value: 'testb',
        msg: 'required',
        param: 'email',
        location: 'body'
      }
    ]
  }
  */
  express: function validate(err) {
    const errors = Object.values(err.errors);
    return errors.reduce((acc, e) => {
      acc[e.param] = e.msg;
      return acc;
    }, {});
  },
  mongoose: function validate(err) {
    const errors = Object.values(err.errors);
    return errors.reduce((acc, e) => {
      acc[e.path] = e.kind;
      return acc;
    }, {});
  },
};
