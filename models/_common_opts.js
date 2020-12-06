const serializeCfg = {
  virtuals: true,
  transform(_, ret) {
    // eslint-disable-next-line
    delete ret._id;
    // eslint-disable-next-line
    delete ret.__v;
    return ret;
  },
};

/*
  [5.10.13] 버전을 기준으로 한다. (몽고는 4.x버전인듯)
  Schema 에서 다루는 옵션들 모음 (직관적인 방향으로 설정함.)
  - 셰마 문서에서 옵션을 다루는 부분이 약 절반정도이다. 거의 다 다룬셈.
  https://mongoosejs.com/docs/guide.html#id
  사용 가능한 거의 모든 옵션을 여기서 다뤘음. (2020/11 latest)
*/
module.exports = {
  // [개발용] DB 연결 성공 시 Index, Model을 DB에 생성한다.
  autoIndex: true,
  autoCreate: true,

  bufferCommands: true, // DB와 연결이 끊겼을 때 쿼리 등을 버퍼링 했다 재연결 시 실행 (기본값)

  capped: false, // 원형 큐처럼 객체들을 한정 공간안에 담고, 꽉 찰 경우 처음 담긴 객체부터 덮어씀. (크기 설정은 페이지 참고)
  // https://mongoosejs.com/docs/guide.html#capped

  collection: false, // String으로 DB에서 사용될 모델명 지정 (기본: 복수형 명사 사용)
  _id: true, // _id를 생성 여부. false는 모델이 아닌 Subdocument에만 적용 가능 (현재 Subdocument의 요건이 뭔지 아직 모름)
  id: true, // virtual id getter를 자동 생성할 지 여부
  minimize: true, // 저장 시, 빈 배열 등의 빈 값인 필드를 아예 제거(=> undefined)한다.

  // read: [읽을 때 sharding 관련 옵션. 아마 어느 분산 노드까지(replica도 되는지 등) 읽어도 되는지 허용 범위를 명시하는 듯 함]
  // writeConcern: [쓸 때 분산 관련 옵션을 설정하는듯]
  // https://docs.mongodb.com/manual/reference/write-concern/ 참고. 너무 어렵다.
  // shardKey: 샤딩(https://docs.mongodb.com/manual/sharding/)에 관해 읽어보자 ㅠㅠ

  // toJSON, toObject 시 이하의 설정을 적용한다.
  toJSON: serializeCfg,
  toObject: serializeCfg,
  validateBeforeSave: true, // Mongoose 기본옵션
  // collation: {
  //   // http://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-34-collations
  //   // Collation은 유사 언어 검색 시 San Jose와 San Jos~e~ 를 같이 검색할 수 있게 하는 옵션이다.
  //   // 한국어는 별 소용이 없는 듯 하다.
  //   locale: 'ko',
  // },
  // versionKey: true, // false인 경우 versionKey: __v 제거, String만 입력해야 함 - https://github.com/Automattic/mongoose/issues/3747 (Invalid path 오류)
  timestamps: true, // createdAt, updatedAt 생성 및 생성 옵션 (obj)
  strict: 'throw', // 몽구스 모델 생성자로 모델에 없는 필드가 전달되는 경우
  // true: 조용히 DB에 저장하지 않음. (기본값)
  // false: 그냥 저장
  // 'throw': 오류 발생 (이게 나은듯.)

  useNestedStrict: false, // 모델의 서브 도큐먼트의 strict 옵션을 존중할 지 여부. 일단 true로 놓자.
  // version key가 없으면 버전이 맞지 않는 객체를 저장할 수도 있게 된다. [다만 그럴 일이 있는가?에 대해선 나중에 알아볼 일이다]
  // 보통은 field 중 배열 같은 좀 sub document 같은 것에서 문제가 발생되는 듯하다. 아직은 잘 모르겠다.
};
