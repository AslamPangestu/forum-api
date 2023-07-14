FROM node:16.20.1-alpine3.18

# Install NodeJS
RUN apk update && apk upgrade && apk add yarn
RUN yarn global add pm2

# Setup Project
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
COPY .env ./
RUN yarn install
COPY . .
RUN yarn migrate
RUN pm2 start ecosystem.config.js

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]