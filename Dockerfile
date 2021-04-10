FROM node:10

WORKDIR /app

# VOLUME /app/.env

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

ENTRYPOINT ["node", "index.js"]
