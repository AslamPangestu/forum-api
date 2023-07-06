# syntax = docker/dockerfile:1.2
FROM nginx:1.21.6-alpine

# Setup ENV
RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env

# Setup NGINX Config
COPY /docker/nginx/default.conf /etc/nginx/conf.d/

# Install NodeJS
RUN apk update && apk upgrade && apk add nodejs npm yarn
RUN yarn global add pm2

# Setup Project
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install && yarn migrate
COPY . .

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]