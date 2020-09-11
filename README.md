
# Study NodeJs Typescript

NodeJs와 Typescript 스택으로 백엔드 개발해보기 프로젝트

- 프레임워크는 `express@latest` 기반으로 진행 (minimal)

## How to run

1. 환경변수(`.env`) 추가

    ```text
    NODE_ENV=development
    DEBUG=app:*
    PORT=3000
    JWT_SECRET=
    ```

2. 의존성 설치

    ```bash
    npm i -g nodemon

    // 환경으로 Node, Mongo 설치
    ```

3. `npm start`

## Current Features

1. `POST /register (enctype: formdata)`

2. `POST /login (enctype: formdata)`

3. `GET /api (returns 200 if authenticated)`

## Current TODO

1. `bcrypt` 활용

2. `Prisma` 도입

## Requirements

1. Jest 기반 Testing 나아가서 TDD, BDD 활용

2. Graph QL API

3. Stateless Authentication/Authorization

4. NoSQL

5. Typescript Support
