FROM node:24-alpine

ARG VERSION
LABEL org.opencontainers.image.version=$VERSION

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["node", "src/index.js"]
