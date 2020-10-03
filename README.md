
# Study NodeJs Typescript

NodeJs, Typescript 스택으로 백엔드 개발

- 프레임워크는 `express@latest` 기반으로 진행 (minimal)

## How to run

1. 환경변수(`.env`) 추가

    ```text
    NODE_ENV=development
    DEBUG=app:*
    PORT=3000
    JWT_SECRET={any_string_is_fine}

    JWT_ACC_EXP = 5m
    JWT_RFR_EXP = 30m
    ```

2. 의존성 설치

    ```bash
    npm i -g nodemon

    // 환경으로 Node, Mongo 설치
    ```

3. `npm start`

## Current Features

1. Go check out `localhost:3000/docs`

## Next Move

1. User Schema Validation on create, update (:heavy_check_mark:)

2. Ticket API - CRUD, Validation

3. 공부하면서 참조한 글들, 작성한 공부 문서들 업로드

## Milestone

1. Jest 기반 Testing 나아가서 TDD, BDD 활용

2. https Support

3. Learn more about Mongo and Mongoose

4. Typescript Support
