# NodeJS HelloWorld

Runs http ok-server on localhost:28080

```sh
cp .env.example .env
npm i

npm run dev
npm run test

docker compose build
docker compose push

. .env.local
scp -r deploy $SSH_ADDRESS:~/nodejs-helloworld
ssh $SSH_ADDRESS "cd ~/nodejs-helloworld && docker-compose up -d"
```
