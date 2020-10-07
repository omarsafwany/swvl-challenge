# Backend Challenge

## Overview

This service exposes **Notifier** that sends notifications to different platforms.(**Email, Push, SMS**)

Clone the repository and run the following scripts:
- `npm run docker` - To create docker container
- `npm run lint`  - To run `eslint`
- `npm run test` -  To run test cases using `mocha`
- `npm run coverage` - To check code coverage using `nyc`

General Notes:

- Schema is implemented using [Ajv](https://github.com/epoberezkin/ajv)

- Rate Limiter is implemented using [limiter](https://www.npmjs.com/package/limiter)
