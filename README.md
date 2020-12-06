# Study NodeJs Typescript

NodeJs, Express, Mongoose

## External Dependencies

1. Installed MongoDB

## How to run

1. Create `.env` file with the content below:

   ```text
   NODE_ENV=development
   DEBUG=app:*
   PORT=3000
   JWT_SECRET={ please type your password here without these brackets }

   JWT_ACC_EXP = 5m
   JWT_RFR_EXP = 30m
   ```

2. Installing global node dependencies:

   1. `nodemon`

3. Run with command: `npm start`

## Code Convention

1. Using ESLint and Prettier

2. Checkout the rules from `.prettierrc.yml` and `.eslintrc.yml`

## Current Features

1. Partial (currently supports only User API) Documentation: `localhost:3000/docs`

2. User, Lesson, LessonSpec, Branch CRUD API

## Upcoming Features

1. Up-to-date Documentation

2. Test preset either Jest or Postman

3. Proper authorization for new APIs (other than User API)

## Libraries serving major roles

1. express [ 분량이 적어 학습 곡선 낮음. 직접 처리해야 하는 부분이 매우 많음 ]

2. mongoose [ API 자세하게 학습. 문서화 불친절한 편 ]

3. passport [ JWT 필터로 일회성으로 활용 ]

## Libraries serving minor roles

1. mongoose-delete

2. express-validator

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
