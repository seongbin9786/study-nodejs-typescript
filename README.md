# Study NodeJs Typescript

NodeJs, Express, Mongoose 연습 프로젝트

- 프레임워크는 `express@latest` 기반으로 진행 (minimal)
- MongoDB 환경에서 Mongoose를 적절히 활용하는데 첫 번째 초점이,
- Javascript 기반 백엔드 프로젝트 상에서 확장 가능한 설계를 해보는 것에 두 번째 초점이 맞춰져 있습니다.

## How to run the backend server

1. 환경변수(`.env`) 추가

   ```text
   NODE_ENV=development
   DEBUG=app:*
   PORT=3000
   JWT_SECRET={ please type your password here without these brackets }

   JWT_ACC_EXP = 5m
   JWT_RFR_EXP = 30m
   ```

2. 의존성 설치

   ```bash
   npm i -g nodemon

   // 환경으로 Node, Mongo 설치
   ```

3. `npm start`

## How to run the learning materials

`npm run learning`

## Current Features

1. Local documentation available at: `localhost:3000/docs`

## Libraries serving major roles

1. express [ 학습 곡선 낮음. 분량이 많지 않음 ]

2. mongoose [ API 자세하게 학습함 ]

3. passport [ JWT 필터로 일회성으로 활용함 ]

## Libraries serving minor roles

1. mongoose-delete

2. express-validator

## Next Learning

1. Learn more about Mongoose middlewares, plugins, etc

2. Setting up some relations between Mongoose Schemas

## Next Features

1. User Schema Validation on create, update (:heavy_check_mark:)

2. Voucher/Lecture/Branch API - CRUD, Validation, Up-to-date documentation

## Milestone

1. Tyscript-based Interfaces

2. Auto-generated controllers from Open Api Spec

3. Jest-based Automated Tests

4. Suitably combined or isolated modules

5. HTTPS Support

6. Microservice-friendly Architecture

7. Database Schema taking adavantage of MongoDB

8. Docker-based Development

9. CI/CD Environment
