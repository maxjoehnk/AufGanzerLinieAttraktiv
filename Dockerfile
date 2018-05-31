FROM node:latest

WORKDIR /usr/src

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . /usr/src/

RUN yarn build

ENV PORT 8080

EXPOSE 8080

CMD yarn start
