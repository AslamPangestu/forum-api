FROM nginx:1.21.6-alpine

# Setup NGINX Config
COPY /docker/nginx/default.conf /etc/nginx/conf.d/

# Install NodeJS
RUN apk update && apk upgrade && apk add nodejs npm yarn
RUN yarn global add pm2

# Setup Project
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn migrate

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]