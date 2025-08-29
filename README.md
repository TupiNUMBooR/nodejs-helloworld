# NodeJS HelloWorld

Runs http ok-server on localhost:28080

```sh
touch .env.local
npm ci

npm run dev
npm run test

docker compose build
docker compose push

. .env.local
scp -r deploy $SSH_ADDRESS:~/nodejs-helloworld
ssh $SSH_ADDRESS "cd ~/nodejs-helloworld && docker-compose up -d"
```

# Includes

- [x] http server
- [x] /metrics and /healthz
- [x] logger + httpLogger
- [x] separate .env* files
- [x] tests
- [x] errors handling
- [x] docker compose build
- [x] docker compose deploy
- [x] github ci
  - [x] tests
  - [x] docker build and push
- [x] telegram bot
  - [x] echo
  - [x] payments
- [x] openai api
- [ ] mongodb
