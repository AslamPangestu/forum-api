# syntax = docker/dockerfile:1.2
FROM nginx:1.21.6-alpine

ARG PGHOST

# Setup NGINX Config
COPY /docker/nginx/default.conf /etc/nginx/conf.d/

# Install NodeJS
RUN apk update && apk upgrade && apk add nodejs npm yarn
RUN yarn global add pm2

# Setup ENV
# RUN --mount=type=secret,id=_env,dst=/etc/secrets/.env
RUN echo "ARGNAME=${PGHOST}"
# ENV PORT=$PORT 
# ENV PGHOST=$PGHOST
# ENV PGPORT=$PGPORT
# ENV PGDATABASE=$PGDATABASE
# ENV PGUSER=$PGUSER
# ENV PGPASSWORD=$PGPASSWORD
# ENV ACCESS_TOKEN_KEY=$ACCESS_TOKEN_KEY
# ENV REFRESH_TOKEN_KEY=$REFRESH_TOKEN_KEY
# ENV ACCCESS_TOKEN_AGE=$ACCCESS_TOKEN_AGE

# Setup Project
WORKDIR /usr/src/app
# COPY /etc/secrets/.env ./
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn migrate

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]