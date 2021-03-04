FROM node:14-alpine as builder

LABEL maintainer "Yefta Sutanto <yeftasutanto@gmail.com>"
LABEL org.opencontainers.image.source https://github.com/sportivapp/backend-core

ARG node_env=development

RUN apk update && apk upgrade && apk add --no-cache git

COPY package.json /app/sportivapp/backend-core/package.json
COPY package-lock.json /app/sportivapp/backend-core/package-lock.json

WORKDIR /app/sportivapp/backend-core

RUN npm install

COPY . /app/sportivapp/backend-core

ENV NODE_ENV=$node_env

EXPOSE 3000

ENTRYPOINT npm run start
