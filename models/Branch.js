const mongoose = require('mongoose');
const mongooseDeletePlugin = require('mongoose-delete');

const { Schema } = mongoose;

const CommonOpts = require('./_common_opts');

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
    Input:
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
    /*
    문제가 있음. [month, day] 쌍으로 Unique 제한을 걸고 싶은데 가능한지 모르겠음.
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
  { _id: false },
); // 얘는 ID로 구분할 대상이 아니기 때문

/*
  Branch 버전은 별로 변경되지 않으므로 Local에서 캐싱하는 게 맞다고 본다.
  즉, 프론트엔드에서 JOIN하는 것.
*/
const BranchSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, '지점명은 필수 입력입니다.'],
      minlength: 2,
    },
    // Q. express-validator에서 Schema Validation이 있던데 그걸 알아보자
    // Q. save 시 validation은 어떻게 되는가?
    off_schedules: [DayOffSchema],
    // 오픈 시간(ex: 9)
    open_time: {
      type: Number,
      required: [true, '시작 시각은 필수 입력입니다.'],
    },
    // 마감 시간(ex: 17)
    close_time: {
      type: Number,
      required: [true, '마감 시간은 필수 입력입니다.'],
    },
  },
  CommonOpts,
);

BranchSchema.plugin(mongooseDeletePlugin, {
  overrideMethods: true,
  validateBeforeDelete: false,
});

module.exports = mongoose.model('Branch', BranchSchema);
