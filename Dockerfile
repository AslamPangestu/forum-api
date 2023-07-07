# syntax = docker/dockerfile:1.2
FROM nginx:1.21.6-alpine

# Setup ARGS
ARG PORT 
ARG PGHOST
ARG PGPORT
ARG PGDATABASE
ARG PGUSER
ARG PGPASSWORD
ARG PGSSLMODE
ARG ACCESS_TOKEN_KEY
ARG REFRESH_TOKEN_KEY
ARG ACCCESS_TOKEN_AGE

# Setup NGINX Config
COPY /docker/nginx/default.conf /etc/nginx/conf.d/

# Install NodeJS
RUN apk update && apk upgrade && apk add nodejs npm yarn
RUN yarn global add pm2

# Setup Project
WORKDIR /usr/src/app
# COPY /etc/secrets/.env ./
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn migrate

# CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]