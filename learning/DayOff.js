const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommonOpts = require('../models/_common_opts');

const DayOffSchema = new Schema(
  {
    // 몇 월인지 (ex) 7
    month: {
      type: Number,
      required: [true, '달은 필수 입력입니다.'],
    },
    // 닫는 날짜들
    /*
    frontend에서 캘린더에서 날짜를 클릭해 배열에 담는 형태로 서버로 전송

    월별 스케쥴을 캘린더로 출력할 때는 백엔드에서 Flat하게 전송하면 될 듯
    이렇게 해야 쉬울 것 같음. 물론 프론트엔드에서 해도 되는 부분임
    그러게 이거 되는지 모르겠네 (Mixed 이게 애매한게 - 거의 지원이 없는 any 타입밖에 없음)
    => 차라리 서브타입으로 캐스팅하는게 나을 것 같기도 함.
    => 그냥 프론트엔드에서 배열로 할 수 있게 인터랙션을 만드는 게 나을 것 같음.

    (ex):
    Input(DayOff):
    {
      month: 10,
      off_days: [ 17, 24, 31 ],
      desc: "일요일 휴무",
    },

    Output:
    { day: 17, desc: "일요일 휴무" },
    { day: 24, desc: "공휴일 휴무" },
    { day: 31, desc: "공휴일 휴무" },
  */
    day: {
      // off_days
      type: Number, // [Number], // 이게 Number or Array of Numbers는 안 되나?
      required: [true, '휴무일은 필수 입력입니다.'],
    },
    desc: {
      type: String,
      required: [true, '휴무 설명은 필수 입력입니다.'],
    },
  },
  CommonOpts,
);

module.exports = mongoose.model('DayOff', DayOffSchema);
