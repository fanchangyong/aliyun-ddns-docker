FROM node:10

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

ENTRYPOINT ["node", "index.js"]
