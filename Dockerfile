#FROM node:14.20-alpine
#WORKDIR /usr/src/app
#COPY nanoindentation-dashboard/package*.json ./
#RUN npm install -g @angular/cli
#RUN npm install
#RUN npm ci
#COPY . ./
#ENTRYPOINT npm run testspec

FROM node:current-alpine3.12
RUN apk add chromium
WORKDIR /app

ENV CHROME_BIN=/usr/bin/chromium-browser

COPY ./nanoindentation-dashboard/. ./
RUN npm install
RUN npm run test:ci